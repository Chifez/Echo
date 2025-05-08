<script>
  import Timeline from '$lib/components/timeline.svelte';
  import Dropdown from '$lib/components/ui/dropdown/Dropdown.svelte';

  let display = 'experience';

  const experience = [
    {
      name: 'classroomio',
      detail: 'Frontend Engineer',
      date: 'July 2023 - Present',
      description:
        'Open sourced AI driven Platform for schools or companies to streamline learning and tutoring',
    },
    {
      name: 'Uniflow',
      detail: 'Frontend Developer',
      date: 'April 2023 - March 2023',
      description:
        'A decentralized platform for controlling financial assets and data',
    },
    {
      name: 'Schull Technologies',
      detail: 'Frontend Developer (Intern)',
      date: 'August 2022 - December 2022',
      description: 'IT consulting and E-learning',
    },
  ];

  const work = [
    {
      name: 'template starter',
      detail: 'Nodejs, Javascript, YAML',
      github: 'https://github.com/Chifez/cli-template-starter',
      live: 'https://www.npmjs.com/package/cli-template-starter',
      description:
        'A cli tool to scaffold boiler plate templates frameworks like nextjs,svelte etc., preconfiured with the basic settings skipping the hassle of going through several command prompts',
    },
    {
      name: 'Echo',
      detail: 'Svelte, Typescript, Tailwind, Markdown',
      github: 'https://github.com/Chifez/Echo',
      description:
        'My portfolio and personal blog, which you are currently on.',
    },
    {
      name: 'Nucleus (WIP)',
      detail: 'Nextjs, Tailwind, Supabase',
      github: 'https://github.com/Chifez/nucleus',
      live: 'https://nucleus-b7tk2run8-chifezs-projects.vercel.app/',
      description:
        'A saas application for backend developers to monitor and display their API metrics in a presentable way',
    },
    {
      name: 'Chatbox',
      detail: 'React, Javascript, SocketIO, Nodejs, Expressjs, Tailwind',
      github: 'https://github.com/Chifez/chatBox',
      live: 'https://chat-box-tawny.vercel.app/',
      description:
        'Chatbox is a realtime chat application where users can create a room and share a unique link with their friends to chat in realtime,v1 supports user notifications like users joining and leaving the room,typing actitvity,image messaging',
    },
    {
      name: 'Faloni',
      detail: 'React, Javascript, SocketIO, Nodejs, Expressjs, Tailwind',
      github: 'https://github.com/Chifez/stylbit',
      live: 'https://stylbit.vercel.app/',
      description:
        'Faloni is an e-commerce store,built using typescript,Redux toollkit,stripe for payment gateway and tailwindcss for styling.',
    },
  ];

  const stack = [
    {
      name: 'Frontend Stack',
      detail: 'React/Nextjs, Svelte, Ruby on Rails',
      description: 'Researching AI advancements and large language models.',
    },
    {
      name: 'Backend Stack',
      detail: 'Nodejs, Expressjs',
      description:
        'Developed and maintained backend services for high-traffic websites.',
    },
    {
      name: 'Database',
      detail: 'MongoDB, MySQL, Firebase, Supabase',
      description:
        'Developed and maintained backend services for high-traffic websites.',
    },
    {
      name: 'Programming Languages',
      detail: 'Typescript, Javascript, Postgresql, Ruby',
      description:
        'Developed and maintained backend services for high-traffic websites.',
    },
  ];
</script>

<section
  id="works"
  class="flex flex-col items-center justify-center min-h-full space-y-10 py-10 px-7 md:px-14"
>
  <p class="text-3xl font-semibold text-center">Hire me</p>

  <div class="flex flex-col gap-2 items-start w-fit">
    <div class="flex items-center gap-3 ml-10">
      <p class="text-sm text-gray-400">Filter:</p>
      <Dropdown bind:selectedOption={display} />
    </div>
    {#if display === 'experience'}
      <div class="flex flex-col items-center justify-center w-full">
        <Timeline items={experience} />
      </div>
    {:else if display == 'stack'}
      <div class="flex flex-col items-center justify-center w-full">
        <Timeline items={stack} />
      </div>
    {:else}
      <div class="flex flex-col items-center justify-center w-full">
        <Timeline items={work} />
      </div>
    {/if}
  </div>
</section>
