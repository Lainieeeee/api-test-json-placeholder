// ============================================
// 共用 變數
// ============================================
// API URL
const apiUrl = "https://jsonplaceholder.typicode.com";

// ============================================
// 共用 helper function
// ============================================
// 錯誤處理
function handleError(error, message) {
    console.error(error);
    alert(message);  // 顯示錯誤訊息
}






/* ====================================================
顯示資料功能 GET
==================================================== */
const getPostBtn = document.getElementById("getPostBtn"); // 定義 getPostBtn 按鈕
const postList = document.getElementById("getPost"); // 定義 getPost 區塊
// 確保按鈕存在
if (getPostBtn) {
    getPostBtn.addEventListener("click", async (e) => {

        // 停止表單的預設(自動提交)行為，避免網頁重新整理
        e.preventDefault();

        try {
            // 1. 使用 GET 來取得數據
            const response = await fetch(`${apiUrl}/posts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // 2. 回應成功時的處理
            if (response.ok) {
                // 從伺服器回傳的資料改成 JSON 格式
                const result = await response.json();
                // 先清空 <ul> 裡面的元素
                postList.innerHTML = "";
                // 呼叫 postItems 函式來建立 <li> 結構
                postItems(result);
                console.log("success", result);
            } else {
                const errorData = await response.json();
                console.error("失敗:", errorData);
            }

        } catch (error) {
            handleError(error, "無法取得列表");
        }

    });
}
// postItems 函式：每筆資料轉為 <li> 並加入列表中
function postItems(posts) {
    posts.forEach(post => {

        // <ul> 加上樣式
        postList.classList.add("overflow-y-scroll", "h-60", "shadow-[0_0_10px_rgba(0,0,0,0.5)]", "p-4", "rounded-md", "mt-4");

        // 建立 <li> 元素，<li> 加上樣式
        const li = document.createElement("li");
        li.classList.add("my-6");

        // 資料寫入 <li> 的 HTML 結構中
        li.innerHTML = `
            <p class="font-bold mb-2">Title:<span> ${post.title} </span></p>
            <div class="border border-secondary p-4 rounded-md">
                <p>${post.body}</p>
            </div>
        `;

        // <li> 加入 <ul> 中
        postList.appendChild(li);
    });
}

/* ====================================================
新增資料功能 POST
==================================================== */
const postPostBtn = document.getElementById("postPostBtn"); // 定義 postPostBtn 按鈕
// 確保按鈕存在
if (postPostBtn) {
    postPostBtn.addEventListener("click", async(e) => {

        // 停止表單的預設(自動提交)行為，避免網頁重新整理
        e.preventDefault();

        // 1. 取得輸入內容
        const postTitleInput = document.getElementById("postTitle");
        const postContentInput = document.getElementById("postContent");
        const postTitle = postTitleInput.value;
        const postContent = postContentInput.value;

        // 2. 檢查輸入欄位是否空
        if (!postTitle || !postContent) {
            return alert("所有欄位都必須填寫！");
        }

        // 3. 如果輸入正確，執行以下操作
        try {

            // 3-1. 使用 POST 提交資料送到伺服器
            const response = await fetch(`${apiUrl}/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: postTitle,
                    body: postContent
                })
            });
            // 3-2. 回應成功時的處理
            if (response.ok) {
                // 從伺服器回傳的資料改成 JSON 格式
                const result = await response.json();
                // 清空輸入內容
                postTitleInput.value = "";
                postContentInput.value = "";
                alert("傳送成功！", result);
            } else {
                const errorData = await response.json();
                console.error("失敗:", errorData);
            }

        } catch (error) {
            handleError(error, "無法傳送資料");
        }
    });
}

/* ====================================================
資料刪除功能 DELETE
==================================================== */
const deleteBtn = document.getElementById("deleteBtn");
if (deleteBtn) {
    deleteBtn.addEventListener("click", async (e) => {

        // 停止表單的預設(自動提交)行為，避免網頁重新整理
        e.preventDefault();

        // 1. 取得輸入內容
        const deleteId = document.getElementById("deleteId").value;

        // 2. 檢查輸入欄位是否空
        if (!deleteId) {
            return alert("請輸入刪除ID！");
        }

        // 3. 先確認該ID是否存在
        try {
            const checkResponse = await fetch(`${apiUrl}/posts/${deleteId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // IDが存在するかどうか確認
            if (!checkResponse.ok) {
                return alert(`錯誤：ID ${deleteId} 不存在`);
            }

            // IDが存在した場合、削除処理を実行
            const response = await fetch(`${apiUrl}/posts/${deleteId}`, {
                method: "DELETE"
            });

            // 回應成功時的處理
            if (response.ok) {
                // jsonplaceholder の DELETE は通常、内容を返さないので、結果を取得して処理
                const result = await response.json().catch(() => ({}));
                console.log(result);

                // 削除成功のメッセージ
                alert(`成功：ID ${deleteId} 刪除成功`);

                // ??
                document.getElementById("deleteId").value = "";

            } else {
                const errorData = await response.json();
                console.error("刪除失敗:", errorData);
            }

        } catch (error) {
            handleError(error, "無法刪除資料");
        }

    });
}

/* ====================================================
部分資料顯示功能 GET
==================================================== */
const getPartPostBtn = document.getElementById("getPartPostBtn"); // 定義 getPartPostBtn 按鈕
const getPartItem = document.getElementById("getPartItem"); // 定義 getPartItem 區塊
// 確保按鈕存在
if (getPartPostBtn) {
    getPartPostBtn.addEventListener("click", async(e) => {

        // 停止表單的預設(自動提交)行為，避免網頁重新整理
        e.preventDefault();

        // 1. 取得輸入內容
        const getId = document.getElementById("getId").value;

        // 2. 檢查輸入欄位是否空
        if (!getId) {
            return alert("請輸入ID！");
        }

        // 3. 如果輸入正確，執行以下操作
        try {
            // 1. 使用 GET 來取得數據
            const response = await fetch(`${apiUrl}/posts/${getId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // 2. 回應成功時的處理
            if (response.ok) {

                // 從伺服器回傳的資料改成 JSON 格式
                const result = await response.json();
                console.log(result);

                // 呼叫 getPartPostItems 函式來建立 <p> 結構
                getPartPostItems(result, getId);

            } else {
                const errorData = await response.json();
                if (errorData.message) {
                    // サーバーからのエラーメッセージがあれば表示
                    alert(`錯誤：${errorData.message}`);
                } else {
                    // エラーメッセージがない場合は一般的なエラーメッセージを表示
                    alert("無法找到該ID的資料！");
                }
                console.error("失敗:", errorData);
            }

        } catch (error) {
            handleError(error, "無法取得列表");
        }
    });
}
// 顯示文章資料結構/修改資料功能 PUT
function getPartPostItems(result, getId) {

    getPartItem.classList.add('mt-6');
    // 同じIDで何度もクリックすると要素が複製されるのを防ぐ
    getPartItem.innerHTML = "";

    // User ID（非表示）作成
    const userIdPara = document.createElement('p');
    userIdPara.classList.add('hidden');
    userIdPara.innerHTML = `<strong>User ID:</strong> ${result.userId}`;
    getPartItem.appendChild(userIdPara);

    // Post ID（非表示）作成
    const postIdPara = document.createElement('p');
    postIdPara.classList.add('hidden');
    postIdPara.innerHTML = `<strong>Post ID:</strong> ${result.id}`;
    getPartItem.appendChild(postIdPara);

    // 標題部分作成
    const postTitleDiv = document.createElement('div');
    postTitleDiv.classList.add('mb-4');

    const postTitleLabel = document.createElement('label');
    postTitleLabel.setAttribute('for', 'postTitle');
    postTitleLabel.classList.add('block', 'mb-2', 'font-bold');
    postTitleLabel.textContent = "標題";
    postTitleDiv.appendChild(postTitleLabel);

    const postTitleInput = document.createElement('input');
    postTitleInput.type = 'text';
    postTitleInput.id = 'postTitle';
    postTitleInput.classList.add('outline-none', 'border', 'border-secondary', 'p-2', 'w-full', 'rounded-md', 'placeholder:text-secondary', 'inputTransModeOverride');
    postTitleInput.placeholder = "請輸入標題";
    postTitleInput.value = result.title;
    postTitleDiv.appendChild(postTitleInput);

    getPartItem.appendChild(postTitleDiv);

    // 內容部分作成
    const postContentDiv = document.createElement('div');
    postContentDiv.classList.add('mb-4');

    const postContentLabel = document.createElement('label');
    postContentLabel.setAttribute('for', 'postContent');
    postContentLabel.classList.add('block', 'mb-2', 'font-bold');
    postContentLabel.textContent = "內容";
    postContentDiv.appendChild(postContentLabel);

    const postContentTextarea = document.createElement('textarea');
    postContentTextarea.id = 'postContent';
    postContentTextarea.classList.add('outline-none', 'border', 'border-secondary', 'p-2', 'w-full', 'rounded-md', 'placeholder:text-secondary', 'h-40', 'resize-none', 'inputTransModeOverride');
    postContentTextarea.placeholder = "請輸入內容";
    postContentTextarea.value = result.body;
    postContentDiv.appendChild(postContentTextarea);

    getPartItem.appendChild(postContentDiv);

    // 修正ボタン作成
    const putBtn = document.createElement('button');
    putBtn.type = 'button';
    putBtn.id = 'putBtn';
    putBtn.classList.add('bg-black', 'text-avocado', 'text-md', 'px-4', 'py-2', 'rounded-md', 'cursor-pointer', 'hover:opacity-75', 'duration-300', 'block', 'mx-auto');
    putBtn.textContent = "修改";
    getPartItem.appendChild(putBtn);

    /* ====================================================
    修改資料功能 PUT
    ==================================================== */
    putBtn.addEventListener("click", async () => {

        // 1. 取得輸入內容
        const postIdPara = result.userId;
        const postId = result.id;
        const postTitle = postTitleInput.value;
        const postContent = postContentTextarea.value;

        // 2. 檢查輸入欄位是否空
        if (!postIdPara || !postId || !postTitle || !postContent) {
            alert("所有欄位都必須填寫！");
            // 元の入力値に戻す
            postTitleInput.value = result.title;
            postContentTextarea.value = result.body;
            return;
        }

        // 3. 如果輸入正確，執行以下操作
        try {
            // 1. 使用 PUT 來取得數據
            const response = await fetch(`${apiUrl}/posts/${getId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: postTitle,
                    body: postContent
                })
            });

            // 2. 回應成功時的處理
            if (response.ok) {

                // 從伺服器回傳的資料改成 JSON 格式
                const result = await response.json();
                console.log(result);

                alert("修改資料成功");

                // IDの値を空にする
                document.getElementById("getId").value = "";
                userIdPara.innerHTML = "";
                postTitleDiv.style.display = "none";
                postContentDiv.style.display = "none";
                putBtn.style.display = "none";
                return;

            } else {
                const errorData = await response.json();
                console.error("失敗:", errorData);
            }

        } catch (error) {
            handleError(error, "無法修改資料");
        }
    });

}