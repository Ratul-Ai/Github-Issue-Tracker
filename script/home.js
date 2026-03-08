const api = {
  allIssues: "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  singleIssue: (id) =>
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
  searchIssues: (searchText) =>
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`,
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

const loadAllIssue = async () => {
  try {
    const allIssues = await fetchJson(api.allIssues);
    renderIssues(allIssues);
  } catch (error) {
    console.error("Failed to load All Issues.", error);
  }
};


/// render Issues 
const renderIssues = (issues) => {
  const container = document.getElementById("card-container");
  const issueStatus=document.getElementById('issue-status');
  const totalIssue=issues.length;
  issueStatus.innerText=`${totalIssue} ${totalIssue===1?'Issue':'Issues'}`;
  container.innerHTML = issues.map((issue) => `
         <div class="card bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden border-t-4 ${issue.status === "open" ? "border-t-green-500" : "border-t-purple-500"} grid grid-rows-subgrid row-span-6">
    <div class="card-body p-4 gap-2 grid grid-rows-subgrid row-span-6">

      <!-- Status + Priority -->
      <div class="flex items-center justify-between">
        ${issue.status === "open" 
          ? '<img src="./assets/Open-Status.png" alt="Open status logo"/>' 
          : '<img src="./assets/Closed- Status .png" alt="Closed status logo"/>'}
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
        ${issue.labels.map((label) => `
          <span class="badge badge-soft bg-orange-300 border border-orange-500 text-black text-xs gap-1">
            ${label}
          </span>
        `).join("")}
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
};



loadAllIssue();
