module.exports = {
    build_dir: 'build',
    compile_dir: 'dist',
    coverage_dir: 'coverage',
    app_files: {
        js: [ 'src/**/*.js', '!src/**/*.spec.js'],
        jsunit: [ 'src/**/*.spec.js']
    },
    test_files: {
        unit: [ 'src/**/*.spec.js' ],
        js: [
            'vendor/angular-mocks/angular-mocks.js'
        ]
    },
    vendor_files: {
        js: [
            'vendor/angular/angular.js',
            'vendor/angular-sanitize/angular-sanitize.js',
            'vendor/angular-route/angular-route.js',
            'vendor/angular-cookies/angular-cookies.js',
            'vendor/ng-amd/dist/angular-amd.js',
            'vendor/lodash/dist/lodash.compat.js'
        ],
        css: [
        ],
        assets: [
        ],
        publish: [
        ]
    },
};
