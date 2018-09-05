import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />
          <script src="/static/scripts/intersection-observer.js" />
          <link rel="icon" href="/static/images/favicon.ico" type="image/x-icon" />
          <link rel="stylesheet" href="/static/styles/fonts.css" />
          <link rel="stylesheet" href="/_next/static/style.css" />
          {/* Facebook Pixel Code */}
          <script src="/static/scripts/fb-pixel.js" />
          <noscript>
            <img
              style={{ width: '1px', height: '1px' }}
              src="https://www.facebook.com/tr?id=2153096921626806&ev=PageView&noscript=1"
            />
          </noscript>
          {/* End Facebook Pixel Code */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
