// Raises IPHONEOS_DEPLOYMENT_TARGET for every Pod target to at least the given
// minimum. Some pods (e.g. react-native-svg, async-storage resource bundles)
// still declare 12.4 / 13.4, which current Xcode rejects (supported: 15.0+).
const fs = require('fs');
const path = require('path');
const { withDangerousMod } = require('expo/config-plugins');

const MARKER = '# [withPodsMinDeploymentTarget]';

module.exports = function withPodsMinDeploymentTarget(config, { minVersion = '15.1' } = {}) {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');
      if (podfile.includes(MARKER)) return cfg;

      const snippet = `
    ${MARKER}
    installer.pods_project.targets.each do |t|
      t.build_configurations.each do |bc|
        current = bc.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if current.nil? || Gem::Version.new(current) < Gem::Version.new('${minVersion}')
          bc.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${minVersion}'
        end
      end
    end
`;
      // Insert right after react_native_post_install(...) inside post_install.
      podfile = podfile.replace(
        /(react_native_post_install\([\s\S]*?\n\s*\))/,
        `$1\n${snippet}`
      );
      if (!podfile.includes(MARKER)) {
        throw new Error('withPodsMinDeploymentTarget: could not find react_native_post_install in Podfile');
      }
      fs.writeFileSync(podfilePath, podfile);
      return cfg;
    },
  ]);
};
