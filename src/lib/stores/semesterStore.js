import { browser } from "$app/environment";
import { writable } from "svelte/store";

const defaultValue = "202608";
const storedValue = browser ? window.localStorage.getItem("semester") : null;
const initialValue = storedValue === defaultValue ? storedValue : defaultValue;

const semesterStore = writable(initialValue);

semesterStore.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem("semester", value);
  }
});

export default semesterStore;
