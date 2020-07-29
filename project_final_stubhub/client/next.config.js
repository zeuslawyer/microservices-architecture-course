module.exports = {
  webpackDevMiddleWare: config => {
    config.watchOptions.poll = 300; // enables skaffold and next to watch files faster when run inside a Kube pod
    return config;
  }
};
