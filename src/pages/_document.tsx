import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        
        {/* Meta tags */}
        <meta name="description" content="Rivervalley Rangers AFC - Building Community Through Football. Join our football club for youth development, training, and community spirit." />
        <meta name="keywords" content="football club, youth football, soccer, Dublin, community sports, training, matches" />
        <meta name="author" content="Rivervalley Rangers AFC" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Rivervalley Rangers AFC" />
        <meta property="og:description" content="Building Community Through Football" />
        <meta property="og:image" content="/images/logo.png" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rivervalley Rangers AFC" />
        <meta name="twitter:description" content="Building Community Through Football" />
        <meta name="twitter:image" content="/images/logo.png" />

        {/* Modern Google Fonts for Sports/Tech Feel */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Exo+2:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
