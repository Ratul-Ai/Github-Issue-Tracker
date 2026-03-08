/// API lists 
const api = {
  allIssues: "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  singleIssue: (id) =>
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
  searchIssues: (searchText) =>
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`,
};


/// active buttons
const activeButton = (id) => {
  document.querySelectorAll(".active-btn").forEach((e) => {
    e.classList.add("btn-outline");
  });
  document.getElementById(id).classList.remove("btn-outline");
};


/// error messages
const errorMsg = (status) => {
  if (status) {
    document.getElementById("error-msg").classList.remove("hidden");
  } else {
    document.getElementById("error-msg").classList.add("hidden");
  }
};
const modalErrorMsg = (status) => {
  if (status) {
    document.getElementById("modal-error-msg").classList.remove("hidden");
  } else {
    document.getElementById("modal-error-msg").classList.add("hidden");
  }
};

/// Spinner
const dataLoading = (status) => {
  if (status) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("card-container").innerHTML = "";
  } else {
    document.getElementById("spinner").classList.add("hidden");
  }
};
const modalLoading = (status) => {
  if (status) {
    document.getElementById("modal-spinner").classList.remove("hidden");
    document.getElementById("modal-details").innerHTML = "";
    document.getElementById("issue-modal").showModal();
  } else {
    document.getElementById("modal-spinner").classList.add("hidden");
  }
};

/// data fetching common function
const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Http Error. Status: ${response.status}`);
  }
  const json = await response.json();
  return json.data;
};


/// all data fetching
const loadAllIssue = async () => {
  errorMsg(false);
  dataLoading(true);
  activeButton("all-btn");
  try {
    const allIssues = await fetchJson(api.allIssues);
    renderIssues(allIssues);
  } catch (error) {
    console.error("Failed to load All Issues.", error);
    dataLoading(false);
    errorMsg(true);
  }
};

/// displaying cards
const renderIssues = (issues) => {
  const container = document.getElementById("card-container");
  const issueStatus = document.getElementById("issue-status");
  const totalIssue = issues.length;
  issueStatus.innerText = `${totalIssue} ${totalIssue === 1 ? "Issue" : "Issues"}`;
  if (totalIssue === 0) {
    container.classList.remove("py-10", "px-5");
    container.innerHTML = "";
    dataLoading(false);
    return;
  }
  container.classList.add("py-10", "px-5");
  container.innerHTML = issues
    .map(
      (issue) => `
         <div onclick="renderModal(${issue.id})" class="card bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden border-t-4 ${issue.status === "open" ? "border-t-green-500" : "border-t-purple-500"} grid grid-rows-subgrid row-span-6">
    <div class="card-body p-4 gap-2 grid grid-rows-subgrid row-span-6">

      <!-- Status + Priority -->
      <div class="flex items-center justify-between">
        ${
          issue.status === "open"
            ? '<img src="./assets/Open-Status.png" alt="Open status logo"/>'
            : '<img src="./assets/Closed- Status .png" alt="Closed status logo"/>'
        }
        <span class="badge badge-soft ${
          issue.priority === "high"
            ? "bg-red-100 border-red-300 text-red-500"
            : issue.priority === "medium"
              ? "bg-yellow-50 border-yellow-300 text-yellow-600"
              : "bg-gray-100 border-gray-300 text-gray-500"
        } border font-semibold text-xs px-3">
          ${issue.priority.toUpperCase()}
        </span>
      </div>

      <!-- Title -->
      <h2 class="font-bold self-center text-black text-base">${issue.title}</h2>

      <!-- Description -->
      <p class="text-gray-400 text-sm line-clamp-2">${issue.description}</p>

      <!-- Labels -->
      <div class="mt-2 flex self-center flex-wrap gap-2">
        ${issue.labels
          .map(
            (label) => `
          <span class="badge badge-soft bg-orange-300 border border-orange-500 text-black text-xs gap-1">
            ${label}
          </span>
        `,
          )
          .join("")}
      </div>

      <!--Footer -->
      <hr class="mt-3 border border-gray-300 mb-3">
      
        <div class="self-center text-xs text-gray-400 flex justify-between gap-2">
          <div>
            <p>${issue.author ? `#${issue.id} by ${issue.author}` : ""}</p>
            <p>${issue.assignee ? `Assignee: ${issue.assignee}` : ""}</p>
          </div>
          <div class="text-right">
            <p>${issue.createdAt ? `${new Date(issue.createdAt).toLocaleDateString()}` : ""}</p>
            <p>${issue.updatedAt ? `Updated: ${new Date(issue.updatedAt).toLocaleDateString()}` : ""}
            </p>
          </div>
      </div>

    </div>
  </div>
    
    `,
    )
    .join("");
  dataLoading(false);
};

/// displaying modal
const renderModal = async (id) => {
  modalErrorMsg(false);
  modalLoading(true);
  try {
    const data = await fetchJson(api.singleIssue(id));
    const container = document.getElementById("modal-details");
    container.innerHTML = `
  
    <h2 class="text-2xl font-bold text-black mb-3">${data.title}</h2>

    <!-- Status + Author + Date -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-5">
      <span class="badge text-white font-semibold rounded-full px-3 py-1 ${
        data.status === "open" ? "bg-green-500" : "bg-purple-500"
      }">${data.status === "open" ? "Opened" : "Closed"}</span>
      <span class="text-3xl">•</span>
      <span>Opened by ${data.author}</span>
      <span class="text-3xl">•</span>
      <span>${data.createdAt ? new Date(data.createdAt).toLocaleDateString() : ""}</span>
    </div>

    <!-- Labels -->
    <div class="flex flex-wrap gap-2 mb-5">
      ${data.labels
        .map(
          (label) => `
        <span class="badge badge-soft bg-orange-300 border border-orange-500 text-black text-xs gap-1">
          ${label}
        </span>
      `,
        )
        .join("")}
    </div>

    <!-- Description -->
    <p class="text-gray-500 text-sm leading-relaxed mb-6">${data.description}</p>

    <!-- Assignee + Priority -->
    <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-2 mb-6">
      <div>
        <p class="text-gray-400 text-sm mb-1">Assignee:</p>
        <p class="font-semibold text-gray-800">${data.assignee ? data.assignee : "Unassigned"}</p>
      </div>
      <div >
        <p class="text-gray-400 text-sm mb-1">Priority:</p>
       <span class="badge badge-soft ${
         data.priority === "high"
           ? "bg-red-100 border-red-300 text-red-500"
           : data.priority === "medium"
             ? "bg-yellow-50 border-yellow-300 text-yellow-600"
             : "bg-gray-200 border-gray-400 text-gray-500"
       } border font-semibold text-xs px-3">
          ${data.priority.toUpperCase()}
        </span>
      </div>
    </div>
`;
    modalLoading(false);
  } catch (error) {
    console.error(error);
    modalLoading(false);
    modalErrorMsg(true);
  }
};



/// Event Listener
document.getElementById("open-btn").addEventListener("click", async () => {
  activeButton("open-btn");
  errorMsg(false);
  dataLoading(true);
  try {
    const allIssues = await fetchJson(api.allIssues);
    const filtered = allIssues.filter((issue) => issue.status === "open");
    renderIssues(filtered);
  } catch (error) {
    console.error(error);
    dataLoading(false);
    errorMsg(true);
  }
});
document.getElementById("close-btn").addEventListener("click", async () => {
  activeButton("close-btn");
  errorMsg(false);
  dataLoading(true);
  try {
    const allIssues = await fetchJson(api.allIssues);
    const filtered = allIssues.filter((issue) => issue.status === "closed");
    renderIssues(filtered);
  } catch (error) {
    console.error(error);
    dataLoading(false);
    errorMsg(true);
  }
});
document.getElementById("all-btn").addEventListener("click", async () => {
  loadAllIssue();
});

document.getElementById("search-btn").addEventListener("click", async () => {
  activeButton("search-btn");
  errorMsg(false);
  dataLoading(true);
  try {
    const keyWord = document.getElementById("search-input").value;
    const data = await fetchJson(api.searchIssues(keyWord));
    renderIssues(data);
  } catch (error) {
    console.error(error);
    dataLoading(false);
    errorMsg(true);
  }
});



loadAllIssue();
