<script>
  import Timeline from '$lib/components/Timeline.svelte';
  import Dropdown from '$lib/components/ui/dropdown/Dropdown.svelte';

  let display = 'experience';

  const experience = [
    {
      name: 'classroomio',
      position: 'Frontend Engineer',
      date: 'July 2023 - Present',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus, et.',
    },
    {
      name: 'Uniflow',
      position: 'Frontend Developer',
      date: 'April 2023 - March 2023',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus, et.',
    },
    {
      name: 'Schull Technologies',
      position: 'Frontend Developer (Intern)',
      date: 'August 2022 - December 2022',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus, et.',
    },
  ];

  const work = [
    {
      name: 'OpenAI',
      position: 'AI Researcher',
      date: 'January 2022 - Present',
      description: 'Researching AI advancements and large language models.',
    },
    {
      name: 'Techflow',
      position: 'Backend Developer',
      date: 'May 2021 - December 2021',
      description:
        'Developed and maintained backend services for high-traffic websites.',
    },
  ];
</script>

<section
  id="works"
  class="flex flex-col items-center justify-center bg-gray-50 min-h-full space-y-10 py-10 px-7 md:px-14"
>
  <div class="flex flex-col gap-2 items-start w-fit">
    <div class="flex items-center gap-3 ml-10">
      <p class="text-sm text-gray-400">Filter:</p>
      <Dropdown bind:selectedOption={display} />
    </div>
    {#if display === 'experience'}
      <div class="flex flex-col items-center justify-center w-full">
        <Timeline items={experience} />
      </div>
    {:else}
      <div class="flex flex-col items-center justify-center w-full">
        <Timeline items={work} />
      </div>
    {/if}
  </div>
</section>
