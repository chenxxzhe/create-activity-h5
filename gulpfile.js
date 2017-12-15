const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const inline = require('gulp-inline-source')
const clean = require('gulp-clean')

const postcss = require('gulp-postcss')
const assets = require('postcss-assets')
const px2rem = require('postcss-pxtorem')
const autoprefixer = require('autoprefixer')

const DEST_PATH = './dest'


// 清空中间文件
gulp.task('clean-temp', () => {
  return gulp.src('./src/_temp').pipe(clean())
})
// 处理CSS，自动补前缀，px转rem，图片内联
// 图片转BASE64, 语法是background-image: inline('..');
gulp.task('style', ['clean-temp'], () => {
  return gulp.src('./src/main.css')
    .pipe(postcss([
      px2rem({
        rootValue: 75,
        unitPrecision: 2,
        propList: ['*', '!border', '!background*']
        
      }),
      autoprefixer(),
      assets(),
    ]))
    .pipe(gulp.dest('./src/_temp/'))
})

// 将CSS JS 写入到HTML中
gulp.task('inline', ['style'], () => {
  return gulp.src('./src/index.html')
    .pipe(inline())
    .pipe(gulp.dest(DEST_PATH))
})

// 清空dest文件夹
gulp.task('clean-dest', () => {
  return gulp.src([DEST_PATH]).pipe(clean())
})

// 使用browserSync 自动刷新浏览器
gulp.task('server', ['clean-dest', 'inline'], () => {
  browserSync.init({
    server: {
      baseDir: DEST_PATH
    }
  })
  gulp.watch(['./src/main.css'], ['inline'])
  gulp.watch(['./src/main.js'], ['inline'])
  gulp.watch(DEST_PATH + '/index.html').on('change', browserSync.reload)
})

// 默认任务
gulp.task('default', ['server'])
