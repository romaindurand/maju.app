<script lang="ts">
	interface Props {
		label: string;
		description?: string;
		id?: string;
		checked?: boolean;
	}

	let { label, description, id = `toggle-${crypto.randomUUID()}`, checked = $bindable(false) }: Props = $props();
</script>

<div class="flex items-center justify-between bg-white border-2 border-gray-200 rounded-lg p-4">
	<div>
		<label for={id} class="block font-semibold text-gray-700">{label}</label>
		{#if description}
			<p class="text-sm text-gray-500">{description}</p>
		{/if}
	</div>
	<label class="inline-flex items-center cursor-pointer">
		<input id={id} type="checkbox" bind:checked={checked} class="sr-only" aria-label={label} />
		<span class="w-12 h-6 rounded-full relative transition" style="background-color: {checked ? '#4F46E5' : '#D1D5DB'}">
			<span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" style={`transform: translateX(${checked ? '24px' : '0'})`}></span>
		</span>
	</label>
</div>
