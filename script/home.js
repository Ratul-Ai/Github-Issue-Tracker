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
    renderAllIssues(allIssues);
  } catch (error) {
    console.error("Failed to load All Issues.", error);
  }
};

// "id": 1,
// "title": "Fix navigation menu on mobile devices",
// "description": "The navigation menu doesn't collapse properly on mobile devices. Need to fix the responsive behavior.",
// "status": "open",
// "labels": [
// "bug",
// "help wanted"
// ],
// "priority": "high",
// "author": "john_doe",
// "assignee": "jane_smith",
// "createdAt": "2024-01-15T10:30:00Z",
// "updatedAt": "2024-01-15T10:30:00Z"

const renderAllIssues = (allIssues) => {
  const container = document.getElementById("card-container");
  container.innerHTML = allIssues
    .map(
      (issue) => `
        <div
            class="card bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden border-t-4 ${issue.status === "open" ? "border-t-green-500" : "border-t-purple-500"}"
          >
            <div class="card-body p-4 gap-3">
              <!--/ Status + Priority -->
              <div class="flex items-center justify-between">
              ${issue.status === "open" ? '<img src="./assets/Open-Status.png" alt="Open status logo"/>' : '<img src="./assets/Closed- Status .png" alt="closed status logo">'}
                
                
                <span
                  class="badge badge-soft ${issue.priority === "high" ? "bg-red-100  border-red-300 text-red-500" : issue.priority === "medium" ? " bg-yellow-50 border-yellow-300 text-yellow-600" : "bg-gray-100 border-gray-300 text-gray-500"}  border font-semibold text-xs px-3"
                  >${issue.priority.toUpperCase()}</span
                >
              </div>
              <!--/ Title -->
            
            <h2 class="font-bold text-black flex-1 text-base">${issue.title}</h2>
            
            <!--/ Description -->
            <div class="flex-1">
                <p class="text-gray-400 text-sm line-clamp-2 ">${issue.description}</p>
            </div>
              <!--/ Tags -->
              <div class="flex flex-wrap gap-2">
               ${issue.labels.map((label)=>`<span
                  class="badge badge-soft bg-orange-300 border border-orange-500 text-black text-xs gap-1"
                >${label}
                </span>`).join("")}
                
              </div>
              <hr class="border border-gray-300 my-2 ">
              <!--/ Footer -->
              <div class="text-xs text-gray-400 flex justify-between gap-0.5">
                <div>
                  <p>#1 by john_doe</p>
                  <p>#1 by john_doe</p>
                </div>
                <div>
                  <p>date</p>
                  <p>date</p>
                </div>
                
              </div>
            </div>
          </div>
    
    `,
    )
    .join("");
};

loadAllIssue();
