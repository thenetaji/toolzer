export default {
  siteUrl: process.env.SITE_URL || "https://toolzer.studio/",
  generateIndexSitemap: false,
  exclude: ["/coming-soon"],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: [
          "/~partytown",
          "/coming-soon",
          "/cdn-cgi/l/email-protection",
          "/blog/example",
        ],
      },
    ],
  },
  transform: async (config, path) => {
    let changefreq = "monthly";
    let priority = "0.5";

    if (path === "/") {
      changefreq = "daily";
      priority = "1.0";
    } else if (path.includes("/blog")) {
      changefreq = "monthly";
      priority = "0.6";
    } else if (path.includes("/tools")) {
      changefreq = "weekly";
      priority = "0.8";
    }

    return {
      loc: path,
      changefreq,
      priority,
    };
  },
};
