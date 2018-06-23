import * as colors from 'colors';
import { Gulp } from 'gulp';

import { getConfigs } from './config';
import { ISPBuildSettings, IGulpConfigs } from '../interfaces';

declare var global: any;

export const typescriptTasks = (gulp: Gulp, $: any, settings: ISPBuildSettings) => {

  // Compile TypeScript files
  gulp.task('tsc', async () => {
    console.log(`\n${colors.yellow('===')} ${colors.green('Simple TypeScript compilation')} ${colors.yellow('===')}\n`);

    const configs: IGulpConfigs = global.gulpConfigs || await getConfigs(settings);
    return gulp
      .src(['./src/**/*.ts'])
      .pipe($.tsc.createProject('tsconfig.json')())
      .js.pipe(gulp.dest(configs.appConfig.distFolder));
  });

  gulp.task('tslint', () => {
    const emitError = $.yargs.argv.emitError;
    return gulp.src(['src/**/*.ts'])
      .pipe($.tslint({
        configuration: './tslint.json',
        formatter: 'verbose'
      }))
      .pipe($.tslint.report({
        summarizeFailureOutput: true,
        emitError
      }));
  });

};
