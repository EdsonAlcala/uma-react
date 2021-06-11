/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'UMA React SDK',
  tagline: 'Build Decentralized Synthetic Apps Faster',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'edsonalcala', // Usually your GitHub org/user name.
  projectName: 'uma-react', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'UMA React SDK',
      logo: {
        alt: 'UMA React SDK Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Tutorial',
        },
        {
          href: 'https://github.com/EdsonAlcala/uma-react',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/EdsonAlcala/uma-react',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Defi-Academy.com`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/EdsonAlcala/uma-react/docs-website',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
