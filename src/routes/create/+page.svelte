<script>
  let selectedFile = null;
  let inputImageUrl = '';
  let outputImageUrl = '';
  let loading = false;
  let error = '';

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
</script>

<main>
  <h1>Image Generator</h1>

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

    <button type="submit" disabled={loading || !selectedFile}>
      {loading ? 'Generating...' : 'Generate'}
    </button>
  </form>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <div class="images">
    <div class="image-container">
      <h2>Input Image</h2>
      {#if inputImageUrl}
        <img src={inputImageUrl} alt="Input" />
      {:else}
        <div class="placeholder">No image selected</div>
      {/if}
    </div>

    <div class="image-container">
      <h2>Output Image</h2>
      {#if outputImageUrl}
        <img src={outputImageUrl} alt="Output" />
      {:else if loading}
        <div class="placeholder">Generating...</div>
      {:else}
        <div class="placeholder">No output yet</div>
      {/if}
    </div>
  </div>
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  h1 {
    text-align: center;
  }

  form {
    margin: 20px 0;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  input[type="file"] {
    display: block;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error {
    color: red;
    margin: 10px 0;
  }

  .images {
    display: flex;
    gap: 20px;
    margin-top: 30px;
  }

  .image-container {
    flex: 1;
  }

  .image-container h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .image-container img {
    max-width: 100%;
    height: auto;
    border: 1px solid #ccc;
  }

  .placeholder {
    width: 100%;
    height: 300px;
    border: 2px dashed #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
  }
</style>