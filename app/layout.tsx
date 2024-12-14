'use client';

import {
  makeStyles,
  shorthands,
  FluentProvider,
  webLightTheme,
} from '@fluentui/react-components';
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider
import Header from '@/components/Header'; // Import the Header component

import '@/styles/global.css';

const useStyles = makeStyles({
  container: {
    ...shorthands.padding('20px')
  }
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const styles = useStyles();

  return (
    <html>
      <body>
        <FluentProvider theme={webLightTheme}>
          <AuthProvider>
            <Header />

            <div className={styles.container}>
              {children}
            </div>

          </AuthProvider>
        </FluentProvider>
      </body>
    </html>
  );
}
