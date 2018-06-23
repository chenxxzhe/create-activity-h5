const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const inline = require('gulp-inline-source')
const clean = require('gulp-clean')

const plumber = require('gulp-plumber')
const notify = require('gulp-notify')

const less = require('gulp-less')

const postcss = require('gulp-postcss')
const assets = require('postcss-assets')
const px2rem = require('postcss-pxtorem')
const autoprefixer = require('autoprefixer')

const path = require('path')
const DEST_PATH = path.resolve(__dirname, './dest')


// 清空中间文件
gulp.task('clean-temp', () => {
  return gulp.src('./src/_temp').pipe(clean())
})
// 处理CSS，自动补前缀，px转rem，图片内联
// 图片转BASE64, 语法是background-image: inline('..');
gulp.task('style', ['clean-temp'], () => {
  return gulp.src('./src/*.less')
    // css错误时不会 shutdown
    .pipe(plumber({errorHandler: notify.onError('Error: <%=error.message%>')}))
    .pipe(less())
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

// 清空构建产物的图片资源
gulp.task('clean-dest-assets', () => {
  return gulp.src(DEST_PATH + '/assets').pipe(clean())
})
// 搬运资源
gulp.task('copy-asset', ['clean-dest-assets'], () => {
  return gulp.src('./src/assets/*')
    .pipe(gulp.dest(DEST_PATH + '/assets/'))
})

// 将CSS JS 写入到HTML中
gulp.task('inline', ['style'], () => {
  return gulp.src('./src/*.html')
    .pipe(inline())
    .pipe(gulp.dest(DEST_PATH))
})



// 运行项目，使用browserSync 自动刷新浏览器
gulp.task('server', ['clean-dest', 'copy-asset', 'inline'], () => {
  browserSync.init({
    server: {
      baseDir: DEST_PATH
    }
  })
  // 资源变动要重新复制
  gulp.watch(['./src/assets/*'], ['copy-asset']).on('change', browserSync.reload)
  // 代码变动要重新构建
  gulp.watch(['./src/*.less', './src/*.js', './src/*.html'], ['inline']).on('change', browserSync.reload)
})

// 清空dest文件夹
gulp.task('clean-dest', () => {
  return gulp.src([DEST_PATH]).pipe(clean())
})

// 默认任务
gulp.task('default', ['clean-dest', 'server'])
