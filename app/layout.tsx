'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiManager } from '@/services';
import {
  makeStyles,
  shorthands,
  FluentProvider,
  webLightTheme,
  Text
} from '@fluentui/react-components'

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
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await apiManager.getMe();
        setUsername(user.username);
      } catch (error) {
        console.error('Error fetching user:', error);
        apiManager.removeToken();
        apiManager.setCurrentUser(null);
        router.push('/login')
      }
    };

    fetchUser();
  }, [apiManager]);

  return (
    <html>
      <body>
        <FluentProvider theme={webLightTheme} >
          <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
            <Text size={400}>{username ? `${username}` : 'Loading...'}</Text>
          </header>
          <div className={styles.container}>
            {children}
          </div>

        </FluentProvider>
      </body>
    </html>
  )
}
