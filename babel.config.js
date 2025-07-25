module.exports = {
  presets: [
    [
      '@babel/preset-react',
      {
        pragma: 'dom', // default pragma is React.createElement (only in classic runtime)
        pragmaFrag: 'DomFrag', // default is React.Fragment (only in classic runtime)
        throwIfNamespace: false, // defaults to true
        runtime: 'classic', // defaults to classic
        // importSource: 'custom-jsx-library' // defaults to react (only in automatic runtime)
      },
    ],
  ],
}
