<script>
  export let label = ''; // Label for the dropdown
  export let options = []; // Array of options to choose from
  export let bindValue = ''; // Two-way binding for the selected value
</script>

<div class="w-full">
  <label class="block text-sm font-medium text-gray-700">{label}</label>
  <select bind:value={bindValue} class="mt-1 block w-full bg-white border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
    {#each options as option}
      <option value={option.value}>{option.text}</option>
    {/each}
  </select>
</div>
