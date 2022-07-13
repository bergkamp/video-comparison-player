'use strict';
var os = require('os');
var path = require('path')

var platform = os.platform()
var arch = os.arch()

//dev
const isDevelopment = process.env.NODE_ENV === 'development';
var baseDir = isDevelopment ? 'node_modules/' : path.join(__dirname, '../../static');

//ffprobe darwin-arm64 darwin-x64 win32-x64
var ffprobePath = isDevelopment ?
    path.join(
        baseDir,
        '@ffprobe-installer',
        platform+'-'+arch,
        platform === 'win' ? 'ffprobe.exe' : 'ffprobe'
    ) :
    path.join(
        baseDir,
        platform === 'win' ? 'ffprobe.exe' : 'ffprobe'
    );

//ffmpeg
// var ffmpegPath = isDevelopment ?
//     path.join(
//         baseDir,
//         'ffmpeg-static',
//         platform === 'win' ? 'ffmpeg.exe' : 'ffmpeg'
//     ) :
//     path.join(
//         baseDir,
//         platform === 'win' ? 'ffmpeg.exe' : 'ffmpeg'
//     );

// //fluent-ffmpeg https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#readme
const fluentFfmpeg = require('fluent-ffmpeg');
// fluentFfmpeg.setFfmpegPath(ffmpegStatic);
fluentFfmpeg.setFfprobePath(ffprobePath);
module.exports = fluentFfmpeg;