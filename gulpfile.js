const gulp = require('gulp')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const tsify = require('tsify')
const replace = require('gulp-replace')
const rename = require('gulp-rename')
const rimraf = require('gulp-rimraf')
const zip = require('gulp-zip')
const pkg = require('./package.json')

gulp.task('content', function () {
    const bundler = browserify('src/riba.ts').plugin(tsify)
    return bundler.bundle().pipe(source('riba.js')).pipe(gulp.dest('extension'))
})

gulp.task('background', function () {
    const bundler = browserify('src/background.ts').plugin(tsify)
    return bundler
        .bundle()
        .pipe(source('background.js'))
        .pipe(gulp.dest('extension'))
})

gulp.task('compile', gulp.parallel(['background', 'content']))

gulp.task('manifest', function () {
    return gulp
        .src('manifests/chrome.json')
        .pipe(replace('{{ version }}', pkg.version))
        .pipe(replace('{{ description }}', pkg.description))
        .pipe(rename('manifest.json'))
        .pipe(gulp.dest('extension'))
})

gulp.task('icons', function () {
    return gulp.src('icons/*').pipe(gulp.dest('extension'))
})

gulp.task('unpacked', gulp.parallel(['manifest', 'icons', 'compile']))

gulp.task('zip', function () {
    return gulp
        .src('extension/*')
        .pipe(zip('chrome.zip'))
        .pipe(rimraf('extension'))
        .pipe(gulp.dest('packages'))
})

gulp.task('packed', gulp.series(['unpacked', 'zip']))

gulp.task('default', gulp.parallel(['background', 'content']))
