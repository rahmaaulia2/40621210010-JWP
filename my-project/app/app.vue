<template>
  <form @submit.prevent="handleSubmit">
    <div class="mx-14 mt-10 border-2 border-blue-400 rounded-lg">
      <div class="mt-3 text-center text-4xl font-bold">Create New Task</div>
      <div class="p-8">
        <div class="flex justify-center gap-4">
          <input
            type="text"
            name="title"
            v-model="title"
            class="mt-1 block w-1/2 rounded-md border border-slate-300 bg-white px-3 py-4 shadow-sm placeholder:font-semibold placeholder:text-gray-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
            placeholder="Title*"
          />
        </div>
        <div class="text-center mt-10">
          <button
            type="submit"
            class="cursor-pointer rounded-lg bg-green-700 px-8 py-5 text-sm font-semibold text-white"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  </form>
  <div class="shadow-lg rounded-lg overflow-hidden mx-5 md:mx-14 mt-10">
    <table class="w-full table-fixed">
      <thead>
        <tr class="bg-gray-100">
          <th
            class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase"
          >
            No
          </th>
          <th
            class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase"
          >
            Ceklist
          </th>
          <th
            class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase"
          >
            Task
          </th>
          <th
            class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase"
          >
            Status
          </th>
          <th
            class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase"
          >
            Action
          </th>
        </tr>
      </thead>
      <tbody class="bg-white">
        <tr v-for="task in tasks" :key="task.id">
          <td class="py-4 px-6 border-b border-gray-200">{{ task.id }}</td>
          <td class="py-4 px-6 border-b border-gray-200 truncate">
            <input @click="handleEdit(task.id, task.status)" type="checkbox" v-if="task.status === 'incomplete'" />
          </td>
          <td
            :class="
              task.status === 'complete'
                ? 'line-through py-4 px-6 border-b border-gray-200 text-gray-400'
                : 'py-4 px-6 border-b border-gray-200 text-black font-semibold'
            "
          >
            {{ task.title }}
          </td>
          <td class="py-4 px-6 border-b border-gray-200">
            <span
              :class="
                task.status === 'complete'
                  ? 'text-green-500 font-semibold'
                  : 'text-red-500 font-semibold'
              "
              >{{ task.status }}</span
            >
          </td>
          <td class="py-4 px-6 border-b border-gray-200">
            <div class="flex gap-2">
              <button
                @click="handleDelete(task.id)"
                class="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";

const tasks = ref([]);
// const tasks = ref([
//   { id: "1", title: "Belajar PHP", status: "incomplete" },
//   { id: "2", title: "Kerjakan Tugas UX", status: "complete" },
// ]);
const status = ref("incomplete");
const title = ref("");

const handleSubmit = async () => {
  if (!title.value || !title.value.trim()) {
    alert("Title is required");
    return;
  }

  try {
    console.log("Submitting:", { status: status.value, title: title.value }); // debugging
    const res = await $fetch("http://localhost:3001/", {
      method: "POST",
      body: { title: title.value.trim(), status: status.value },
    });
    console.log(res); //melihat response dari server
    alert("Task Created");
    title.value = "";
    await getAllTasks();
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

const handleEdit = async (taskId, status) => {
  try {
    const res = await $fetch("http://localhost:3001/" + taskId, {
      method: "PUT",
      body: { status: status === "incomplete" ? "complete" : "incomplete" },
    });
    console.log(res);
    alert("Task Updated");
    reloadNuxtApp(); //untuk merefresh halaman
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

const handleDelete = async (taskId) => {
  try {
    const res = await $fetch("http://localhost:3001/" + taskId, {
      method: "DELETE",
    });
    console.log(res, "delete");
    alert("Task Deleted");
    reloadNuxtApp();
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

const getAllTasks = async () => {
  try {
    const res = await $fetch("http://localhost:3001/");
    console.log(res);
    tasks.value = res;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

//menarik data saat pertama kali halaman dimuat
onMounted(() => {
  getAllTasks();
});
</script>
