const parentChildMap = new Map();

chrome.tabs.onCreated.addListener(async (tab) => {
  // Find opener tab ID (if any)
  const openerTabId = tab.openerTabId || null;

  if (!openerTabId) return;

  if (!parentChildMap.has(openerTabId)) {
    parentChildMap.set(openerTabId, new Set());
  }
  parentChildMap.get(openerTabId).add(tab.id);

  // Group parent tab + children
  const groupTabs = [openerTabId, ...Array.from(parentChildMap.get(openerTabId))];

  if (groupTabs.length < 2) return;

  try {
    await chrome.tabs.group({ tabIds: groupTabs });
    console.log("Grouped tabs:", groupTabs);
  } catch (e) {
    console.error("Failed to group tabs", e);
  }
});
