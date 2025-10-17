<script>
  import "$lib/globals.scss";
  import "$lib/create.scss";

  let selectedFile = null;
  let inputImageUrl = '';
  let outputImageUrl = '';
  let loading = false;
  let error = '';
  let selected_step = 1;
  let max_step = 1;

  $: if (selected_step > max_step) {
    max_step = selected_step;
  }

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      selectedFile = file;
      inputImageUrl = URL.createObjectURL(file);
      outputImageUrl = '';
      error = '';
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    selected_step = 2;
    
    if (!selectedFile) {
      error = 'Please select an image first';
      return;
    }

    loading = true;
    error = '';
    outputImageUrl = '';

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const blob = await response.blob();
      outputImageUrl = URL.createObjectURL(blob);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  let model_generated = false;
  function stepThree() {
    selected_step = 3;

    setTimeout(() => {
      model_generated = true;
      selected_step = 4;
    }, 20000)
  }
</script>

<main class="creator-main">
  <aside class="sidebar">
    <a href="./"><img src="/3dream.svg" alt="logo" class="logo"/></a>
    <div class="steps">
      <button on:click={() => {selected_step = 1}} class:selected={selected_step == 1}>1: Upload — Upload a sketch</button>
      <button on:click={() => {selected_step = 2}} class:selected={selected_step == 2} disabled={max_step < 2}>2: Imagine — Create a rendering</button>
      <button on:click={() => {selected_step = 3}} class:selected={selected_step == 3} disabled={max_step < 3}>3: Model — Create a 3D model</button>
      <button on:click={() => {selected_step = 4}} class:selected={selected_step == 4} disabled={max_step < 4}>4: Preview — View the final toy</button>
      <button disabled>5: Shipping — Checkout</button>
    </div>
  </aside>
  <div class="main-steps" style={`--step: ${selected_step}`}>
    <div class="step">
      <div class="step-content">
        <h2>Upload an Image</h2>
        <form on:submit={handleSubmit}>
          <div class="form-group">
            <label for="file-input">Upload Image:</label>
            <input 
              id="file-input"
              type="file" 
              accept="image/*" 
              on:change={handleFileSelect}
            />
          </div>

          {#if inputImageUrl}
            <img src={inputImageUrl} alt="Input" class="input-image"/>
          {:else}
            <div class="placeholder">No image selected</div>
          {/if}

          <button class="button" type="submit" disabled={loading || !selectedFile}>
            Next <span>➡️</span>
          </button>
        </form>
      </div>
    </div>
    <div class="step">
      <div class="step-content">
        <h2>Imagine</h2>
        {#if outputImageUrl}
          <img src={outputImageUrl} class="output-image" alt="Output" />
        {:else if loading}
          <div class="placeholder">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-loader-2 loading-spinner"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3a9 9 0 1 0 9 9"/></svg>
              Generating Render...
            </span>
          </div>
        {:else}
          <div class="placeholder">
            An error was encountered. Ensure to submit a standard image file, with a size under 4.5MB.
          </div>
        {/if}
        <button disabled={!outputImageUrl} on:click={stepThree} class="button">Looks good? <span>➡️</span></button>
      </div>
    </div>
    <div class="step">
      <div class="step-content">
        <h2>Model</h2>
        {#if model_generated}
          <div class="placeholder">✅ Model Generated</div>
        {:else}
          <div class="placeholder">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-loader-2 loading-spinner"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3a9 9 0 1 0 9 9"/></svg>
              Generating 3D Model...
            </span>
          </div>
        {/if}
      </div>
    </div>
    <div class="step">
      <h2>Preview</h2>
      Coming soon!
    </div>
  </div>
</main>