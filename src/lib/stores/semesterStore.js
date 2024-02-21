import { browser } from "$app/environment";
import { writable } from "svelte/store";

const defaultValue = "202402";
const initialValue = browser
  ? window.localStorage.getItem("semester") ?? defaultValue
  : defaultValue;

const semesterStore = writable(initialValue);

semesterStore.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem("semester", value);
  }
});

export default semesterStore;
