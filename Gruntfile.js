module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

    var buildConfig = require('./build.conf.js');
    var taskConfig = {
        pkg: grunt.file.readJSON('package.json'),

        meta: {
            banner: '/**\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * <%= pkg.homepage %>\n' +
                ' *\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
                ' */\n'
        },

        changelog: {
            options: {
                dest: 'CHANGELOG.md',
                template: 'changelog.tpl'
            }
        },

        bump: {
            options: {
                files: [
                    'package.json',
                    'bower.json'
                ],
                commit: true,
                commitMessage: 'chore(release): v%VERSION%',
                commitFiles: [
                    'package.json',
                    'bower.json',
                    'CHANGELOG.md',
                    'dist/*.*'
                ],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'origin'
            }
        },
        /**
         * The directories to delete when `grunt clean` is executed.
         */
        clean: [
            '<%= build_dir %>',
            '<%= compile_dir %>',
            '<%= coverage_dir %>'
        ],

        jsbeautifier: {
            modify: {
                src: [
                    '<%= app_files.js %>',
                    '<%= test_files.unit %>',
                    'Gruntfile.js'
                ],
                options: {
                    config: '.jsbeautifyrc'
                }
            },
            verify: {
                src: [
                    '<%= app_files.js %>',
                    '<%= test_files.unit %>',
                    'Gruntfile.js'
                ],
                options: {
                    mode: 'VERIFY_ONLY',
                    config: '.jsbeautifyrc'
                }
            }
        },

        jshint: {
            src: [
                '<%= app_files.js %>'
            ],
            test: [
                '<%= test_files.unit %>'
            ],
            gruntfile: [
                'Gruntfile.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        concat: {
            compile_js: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src: ['<%= app_files.js %>'],
                dest: '<%= compile_dir %>/<%= pkg.name %>.js'
            }
        },

        copy: {
            build_appjs: {
                files: [{
                    src: ['<%= app_files.js %>'],
                    dest: '<%= build_dir %>/',
                    cwd: '.',
                    expand: true
                }]
            },
            build_vendorjs: {
                files: [{
                    src: ['<%= vendor_files.js %>'],
                    dest: '<%= build_dir %>/',
                    cwd: '.',
                    expand: true
                }]
            }
        },

        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            unit: {
                singleRun: true
            },
            continuous: {
                logLevel: 'error',
                client: {
                    captureConsole: false
                },
                coverageReporter: {
                    reporters: [{
                        type: 'html',
                        dir: 'coverage/'
                    }, {
                        type: 'cobertura'
                    }],
                },
                plugins: ['karma-jasmine', 'karma-coverage', 'karma-phantomjs-launcher', 'karma-junit-reporter'],
                reporters: ['dots', 'coverage', 'junit'],
                singleRun: true
            }
        },

        uglify: {
            compile: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: {
                    '<%= compile_dir %>/<%= pkg.name %>.min.js': '<%= concat.compile_js.dest %>'
                }
            }
        },

        delta: {
            /**
             * By default, we want the Live Reload to work for all tasks; this is
             * overridden in some tasks (like this file) where browser resources are
             * unaffected. It runs by default on port 35729, which your browser
             * plugin should auto-detect.
             */
            options: {
                livereload: true
            },

            /**
             * When the Gruntfile changes, we just want to lint it. In fact, when
             * your Gruntfile changes, it will automatically be reloaded!
             */
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile'],
                options: {
                    livereload: false
                }
            },

            /**
             * When our JavaScript source files change, we want to run lint them and
             * run our unit tests.
             */
            jssrc: {
                files: [
                    '<%= app_files.js %>'
                ],
                tasks: ['jshint:src', 'karma:unit', 'copy:build_appjs', 'docs']
            },

            /**
             * When our templates change, we only rewrite the template cache.
             */
            tpls: {
                files: [
                    '<%= app_files.tpl %>'
                ],
                tasks: ['html2js']
            },

            /**
             * When the CSS files change, we need to compile and minify them.
             */
            less: {
                files: ['src/**/*.less'],
                tasks: ['recess:lint', 'recess:build']
            },

            /**
             * When a JavaScript unit test file changes, we only want to lint it and
             * run the unit tests. We don't want to do any live reloading.
             */
            jsunit: {
                files: [
                    '<%= app_files.jsunit %>'
                ],
                tasks: ['jshint:test', 'karma:unit'],
                options: {
                    livereload: false
                }
            }
        }
    };

    grunt.initConfig(grunt.util._.extend(taskConfig, buildConfig));

    grunt.registerTask('cleanUpJs', [
        'jsbeautifier:modify'
    ]);

    grunt.registerTask('verifyJs', [
        'jsbeautifier:verify',
        'jshint'
    ]);

    grunt.registerTask('build', [
        'clean',
        'cleanUpJs',
        'verifyJs',
        'copy:build_appjs',
        'copy:build_vendorjs'
    ]);

    grunt.registerTask('test', ['karma:unit']);

    grunt.registerTask('compile', [
        'concat:compile_js', 'uglify'
    ]);

    grunt.registerTask('test-continuous', ['karma:continuous']);
    grunt.registerTask('build-continuous', ['build', 'test-continuous', 'compile']);

    grunt.registerTask('pre-commit', ['verifyJs', 'test']);

    grunt.renameTask('watch', 'delta');
    grunt.registerTask('watch', ['build', 'test', 'delta']);

    grunt.registerTask('default', ['build', 'test']);
};
