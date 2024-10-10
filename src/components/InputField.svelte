<script>
  export let placeholder = '';
  export let value = '';  // Change bindValue to value
</script>

<input 
  type="text"
  placeholder={placeholder}
  bind:value={value}
  class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
/>
