<script>
  export let user;
</script>

<div class="flex justify-start">
  <div class="grid grid-cols-[auto_1fr] gap-2">
      <!-- <Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" /> -->
      <span class="text-white">Icon</span>
      <div class="card p-4 bg-neutral-400 rounded-tl-none space-y-2">
          <header class="flex justify-between items-center">
              <p class="font-bold">Other user's name</p>
              <!-- <small class="opacity-50">timestamp</small> -->
          </header>
          <p>their message</p>
      </div>
  </div>
</div>