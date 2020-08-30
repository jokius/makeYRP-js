const handling = (commit, rawError) => {
  if (typeof rawError === 'undefined') {
    console.error('error', commit)
  } else {
    console.error('error', rawError.toString())
  }
}

export {
  handling,
}
