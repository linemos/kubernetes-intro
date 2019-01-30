var fs = require('fs');
var path = require('path');

var fetch = require('./fetch.js');

var inFlight; // number of sections being processed (incl. from urls)
var toc; // table of contents
var tocpos; // position to insert table of contents
var ref; // list of refs
var refpos; // position to insert refs
var headings; // keeps track of toc section numbers
var anchors; // for unique naming

var modules = {};

function reset() {
    inFlight = 1;
    toc = [];
    ref = [];
    refpos = -1;
    tocpos = -1;
    headings = [];
    anchors = [];
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function slug(s) {
    return s.toLowerCase().split(' ').join('');
}

function uniqueName(anchor) {
    var s = anchor;
    var suffix = 0;
    while (anchors.indexOf(s)>=0) {
        suffix = (suffix + 1);
        s = anchor+'-'+suffix;
    }
    anchors.push(s);
    return s;
}

function writeFile(outfile,out) {
    if (outfile) {
        fs.writeFile(outfile,out.join('\n'),'utf8');
    }
    else {
        for (var o of out) {
            console.log(o);
        }
    }
}

function process(s,outfile,out,state,callback) {
    var startLevel = 0;
    var lines = s.split('\r').join('').split('\n');
    if (refpos > state.outpos) {
       refpos += lines.length;
    }
    for (var l=0;l<lines.length;l++) {
       var line = lines[l];
       if (line.startsWith('===')) { // && inFlight == 1?
           startLevel = -1;
       }
       if (modules.toc && line.startsWith('!TOC')) {
           tocpos = state.outpos;
           line = undefined;
       }
       if (modules.ref && line && line.startsWith('!REF')) {
           refpos = state.outpos;
           line = undefined;
       }
       if (modules.includeurl && line && line.startsWith('!INCLUDEURL "file:')) {
           line = line.replace('://',':').replace('!INCLUDEURL "file:','!INCLUDE "');
       }
       if (modules.include && line && line.startsWith('!INCLUDE ')) {
           var components = line.match(/^\!INCLUDE \"(.+)\"(.*)$/);
           if (components) {
               var includeFile = path.resolve(components[1]);
               try {
                   var include = fs.readFileSync(includeFile,'utf8').split('\r').join('').split('\n');
                   var shift = 0;
                   if (components[2]) shift = parseInt(components[2].split(',').join('').trim(),10);
                   if (shift) {
                       for (var i in include) {
                           if ((include[i].startsWith('===')) && (i>0)) {
                               include[i-1] = new Array(2).join('#')+' '+include[i-1]; // #
                               include[i] = '';
                               i--;
                           }
                           else if ((include[i].startsWith('---')) && (i>0)) {
                               include[i-1] = new Array(3).join('#')+' '+include[i-1]; // ##
                               include[i] = '';
                               i--;
                           }
                           if (include[i].startsWith('#')) {
                               include[i] = new Array(shift+1).join('#')+include[i];
                           }
                       }
                   }
                   inFlight++;
                   process(include.join('\n')+'\n',outfile,out,state,writeFile);
               }
               catch (ex) {
                   console.log(ex);
               }
               line = undefined;
           }
       }
       if (modules.includeurl && line && line.startsWith('!INCLUDEURL ')) {
           var components = line.match(/^\!INCLUDEURL \"(.+)\"/);
           if (components) {
               inFlight++;
               var url = components[1];
               fetch.get(url,{},clone(state),function(err, resp, body, newState) {
                   if (!err) {
                       process(body,outfile,out,newState,writeFile);
                   }
               });
               line = undefined;
           }
       }
       if (modules.toc && line && (line.startsWith('---')) && (l>0)) {
           var name = uniqueName(slug(lines[l-1].split('#').join('')));
           var anchor = '<a name="'+name+'"></a>';
           out.splice(state.outpos-1,0,anchor);
           state.outpos++;
           headings[0]++;
           out.splice(state.outpos-1,0,'');
           state.outpos++;
           // toc.splice(0,0,headings[0]+'\\.  ['+out[out.length-1]+'](#'+name+')  ');
           toc.splice(0,0,headings[0]+'(#'+name+')  ');
           // out[out.length-1] = headings[0]+'\\. '+out[out.length-1];
           out[out.length-1] = headings[0];
       }
       if (modules.toc && line && line.match(/^\#+/)) {
           var level = startLevel;
           var newline = line;
           var prefix = '';
           while (newline.startsWith('#')) {
               newline = newline.substr(1);
               prefix += '#';
               level++;
           }
           while (headings.length<level) {
               headings.push(0);
           }
           while (headings.length>level) {
               headings.pop();
           }
           headings[level-1] += 1;
           newline = newline.trim();
           var name = uniqueName(slug(newline.split('#').join('')));
           var anchor = '<a name="'+name+'"></a>';
           var heading = '';
           for (var h of headings) {
               heading = h;
           }
           toc.splice(0,0,heading+'(#'+name+')  ');
           newline = prefix+''+newline;
           out.splice(state.outpos,0,newline);
           out.splice(state.outpos,0,'');
           out.splice(state.outpos,0,anchor);
           state.outpos += 3;
           line = undefined;
       }
       if (modules.youtubeembed && line && line.startsWith('!VIDEO')) {
           var components = line.split('/');
           var video = components[components.length-1].replace('"','').replace("'",'');
           line = '[![Link to Youtube video](http://img.youtube.com/vi/'+video+'/0.jpg)](http://www.youtube.com/watch?v='+video+')';
       }
       if (modules.latexrender && line && line.startsWith('$') && line.endsWith('$')) {
           line = line.substr(1,line.length-2); // TODO blocks
           line = '![latex](https://chart.googleapis.com/chart?cht=tx&chl='+encodeURIComponent(line)+')';
       }
       if (modules.ref && line) {
           var rline = line.replace(/`.*`/,'``');
           var components = rline.match(/\[(.+)\]:\ (.+)\ \"(.*)\"/);
           if (components && !rline.startsWith('    ') && !rline.startsWith('\t')) {
               ref.splice(0,0,'*\t['+components[3]+']['+components[1]+']');
           }
       }

       if (typeof line !== 'undefined') {
           out.splice(state.outpos,0,line);
           state.outpos++;
       }
    }

    inFlight--;
    if (inFlight<=0) {
       if (modules.toc && tocpos >= 0) {
           for (var t of toc) {
               out.splice(tocpos,0,t);
           }
       }
       if (modules.ref && refpos >= 0) {
           for (var r of ref) {
               out.splice(refpos+toc.length,0,r);
           }
       }
       callback(outfile,out);
    }
    return out;
}

modules.include = true;
modules.includeurl = true;
modules.youtubeembed = true;
modules.latexrender = true;
modules.toc = true;
modules.ref = true;

module.exports = {

    render: function(infile, outfile) {
        var state = {};
        state.outpos = 0;
        reset();
        headings.push(0);
        fs.readFile(infile,'utf8',function(err, s){
            process(s,outfile,[],state,writeFile);
        });
    },

    modules : modules

};
