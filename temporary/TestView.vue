<template>
  <div class="p-4">
    <h2>Login & Submit Score</h2>

    <button @click="onClick1">Test</button>

    <div>
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="authenticateAndSubmit">Send</button>
    </div>

    <p v-if="result">{{ result }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// form fields
const username = ref('')
const password = ref('')
const result = ref('')

// Click handler
async function authenticateAndSubmit() {
  result.value = 'Authenticating...'

  // 1️⃣ Authenticate User
  const authResponse = await fetch('/api/Authentication/Authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true'
    },
    body: JSON.stringify({
      userName: username.value,
      password: password.value
    })
  })

  if (!authResponse.ok) {
    result.value = 'Authentication failed!'
    return
  }

  const authData = await authResponse.json()
  console.log('Auth response:', authData)

  result.value = 'Authenticated. Submitting score...'

  // OPTIONAL: if backend uses auth cookies / token, process here
  // e.g., const token = authData.token

  // 2️⃣ Submit Raw Score
  const scorePayload = {
    JsonPayload: JSON.stringify({
      score: 100,
      timestamp: new Date().toISOString()
    })
  }

  const scoreResponse = await fetch('https://dashboard.dev.bio-streams.eu/api/seriousgames/scores/submit-raw-score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true'
      // If token required:
      // 'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(scorePayload)
  })

  if (!scoreResponse.ok) {
    result.value = 'Submitting score failed'
    return
  }

  const scoreResult = await scoreResponse.json()
  console.log('Score response:', scoreResult)

  result.value = 'Score submitted successfully!'
}



async function onClick1() {

  // 2️⃣ Submit Raw Score
  const scorePayload = {
    JsonPayload: JSON.stringify({
      score: 100,
      timestamp: new Date().toISOString()
    })
  }

  const scoreResponse = await fetch('/api/seriousgames/scores/submit-raw-score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true'
      // If token required:
      // 'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(scorePayload)
  })

  if (!scoreResponse.ok) {
    result.value = 'Submitting score failed'
    return
  }

  const scoreResult = await scoreResponse.json()
  console.log('Score response:', scoreResult)

  result.value = 'Score submitted successfully!'

}
</script>
