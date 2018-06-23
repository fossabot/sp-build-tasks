import * as colors from 'colors';
import Deploy from '../utils/deploy';
import { ReloadProvisioning } from 'sp-live-reload';

import { Gulp } from 'gulp';

import { getConfigs } from './config';
import { ISPBuildSettings, IGulpConfigs } from '../interfaces';

declare var global: any;

export const deployTasks = (gulp: Gulp, $: any, settings: ISPBuildSettings) => {

  gulp.task('reload:install', async cb => {
    console.log(`\n${colors.yellow('===')} ${colors.green('Installing live reload to site collection')} ${colors.yellow('===')}\n`);

    const configs: IGulpConfigs = global.gulpConfigs || await getConfigs(settings);
    const liveReload = new ReloadProvisioning(configs.liveReload);
    liveReload.provisionMonitoringAction()
      .then(_ => {
        console.log('Custom action has been installed');
        cb();
      })
      .catch(err => {
        console.log(err.message);
        cb();
      });

  });

  gulp.task('reload:retract', async cb => {
    console.log(`\n${colors.yellow('===')} ${colors.green('Retracting live reload from site collection')} ${colors.yellow('===')}\n`);

    const configs: IGulpConfigs = global.gulpConfigs || await getConfigs(settings);
    const liveReload = new ReloadProvisioning(configs.liveReload);
    liveReload.retractMonitoringAction()
      .then(_ => {
        console.log('Custom action has been retracted');
        cb();
      })
      .catch(err => {
        console.log(err.message);
        cb();
      });

  });

  gulp.task('masterpage:restore', async cb => {
    console.log(`\n${colors.yellow('===')} ${colors.green('Restoring masterpage on the web')} ${colors.yellow('===')}\n`);

    const configs: IGulpConfigs = global.gulpConfigs || await getConfigs(settings);
    const deploy = new Deploy({
      siteUrl: configs.privateConf.siteUrl,
      creds: configs.privateConf.creds,
      dist: configs.appConfig.distFolder,
      spFolder: configs.appConfig.spFolder
    });

    deploy.applyMasterpageToWeb({
      spFolder: '/',
      masterpagePath: '_catalogs/masterpage/seattle.master'
    })
      .then(masterpageFullPath => {
        console.log('Masterpage has been applied: ' + masterpageFullPath);
        cb();
      })
      .catch(err => {
        cb(err.message);
      });
  });

  gulp.task('masterpage:apply', ['logo:apply'], async cb => {
    console.log(`\n${colors.yellow('===')} ${colors.green('Applying masterpage to the web')} ${colors.yellow('===')}\n`);

    const configs: IGulpConfigs = global.gulpConfigs || await getConfigs(settings);
    if (typeof configs.appConfig.masterpagePath !== 'undefined') {
      const deploy = new Deploy({
        siteUrl: configs.privateConf.siteUrl,
        creds: configs.privateConf.creds,
        dist: configs.appConfig.distFolder,
        spFolder: configs.appConfig.spFolder
      });
      deploy.applyMasterpageToWeb({
        masterpagePath: configs.appConfig.masterpagePath
      })
        .then(masterpageFullPath => {
          console.log('Masterpage has been applied: ' + masterpageFullPath);
          cb();
        })
        .catch(err => {
          cb(err.message);
        });
    } else {
      cb(`Property 'masterpagePath' is missed in ./config/app.json`);
    }
  });

  gulp.task('logo:apply', async cb => {
    console.log(`\n${colors.yellow('===')} ${colors.green('Applying logotype to the web')} ${colors.yellow('===')}\n`);

    const configs: IGulpConfigs = global.gulpConfigs || await getConfigs(settings);
    if (typeof configs.appConfig.masterpagePath !== 'undefined') {
      const deploy = new Deploy({
        siteUrl: configs.privateConf.siteUrl,
        creds: configs.privateConf.creds,
        dist: configs.appConfig.distFolder,
        spFolder: configs.appConfig.spFolder
      });
      deploy.applyLogotypeToWeb({
        logoPath: configs.appConfig.logoPath
      })
        .then(_logoFullPath => {
          cb();
        })
        .catch(err => {
          cb(err.message);
        });
    } else {
      cb(`Property 'logoPath' is missed in ./config/app.json`);
    }
  });

};
