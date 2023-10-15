// import React from 'react';
// import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// import Generator from 'react-router-sitemap-generator';

// function Sitemap() {
//   return (
//     <Router>
//       <Routes>
//         <Route exact path="/" />
//         <Route exact path="/design" />
//         <Route exact path="/design/about" />
//         <Route exact path="/design/portfolio" />
//         <Route exact path="/music" />
//         <Route exact path="/music/about" />
//         <Route exact path="/music/portfolio" />
//         <Route exact path="/music/showreel" />
//       </Routes>
//     </Router>
//   );
// }

// const generator = new Generator('https://dariodumlijan.com', Sitemap(), {
//   lastmod: new Date().toISOString().slice(0, 10),
//   changefreq: 'monthly',
//   priority: 0.8,
// });
// generator.save('public/sitemap.xml');
