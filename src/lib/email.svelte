<script>
  import { Button, Hr, Html, Text } from 'svelte-email';
  import { EmailContent } from './store';

  let content = $EmailContent.content;
</script>

<Html lang="en">
  <Text>Hello, Emmanuel!</Text>
  <Text>{content}</Text>

  <Hr />
  <Button href="https://svelte.dev">Visit Svelte</Button>
</Html>
