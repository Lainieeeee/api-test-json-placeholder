// ============================================
// 共用 變數
// ============================================
// API URL
export const apiUrl = "https://jsonplaceholder.typicode.com";

// ============================================
// 共用 helper function
// ============================================
// 錯誤處理
export function handleError(error, message) {
    console.error(error);
    alert(message);  // 顯示錯誤訊息
}