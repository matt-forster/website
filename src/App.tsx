import { Main } from './components';
import { MetaProvider, Title, Meta } from 'solid-meta';
import { ThemeProvider } from './context/theme';

export default () => (
  <ThemeProvider>
    <MetaProvider>
      <Meta charset="utf-8" />
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta name="theme-color" content="#000000" />
      <link rel="shortcut icon" type="image/ico" href="/src/assets/favicon.ico" />
      <Title>Matt Forster</Title>
      <Main />
    </MetaProvider>
  </ThemeProvider>
)
