"use client"

import { useState, useEffect } from "react"
import {
  ChevronRight,
  Check,
  User,
  Coffee,
  Save,
  RotateCcw,
  Lock,
  Plus,
  Edit,
  Trash,
  X,
  Clock,
  ArrowLeft,
} from "lucide-react"

const WorkAllocationApp = () => {
  // 翌日の日付を取得
  const getNextDate = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    return tomorrow.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const [nextDate, setNextDate] = useState(getNextDate())

  // ローカルストレージからデータを読み込む
  const loadFromLocalStorage = () => {
    try {
      const savedAttendance = localStorage.getItem("attendanceList")
      const savedTare = localStorage.getItem("selectedTare")
      const savedAllocation = localStorage.getItem("workAllocation")
      const savedIsAllocated = localStorage.getItem("isAllocated")
      const savedHistory = localStorage.getItem("allocationHistory")

      return {
        attendanceList: savedAttendance ? JSON.parse(savedAttendance) : null,
        selectedTare: savedTare ? JSON.parse(savedTare) : null,
        workAllocation: savedAllocation ? JSON.parse(savedAllocation) : {},
        isAllocated: savedIsAllocated ? JSON.parse(savedIsAllocated) : false,
        allocationHistory: savedHistory ? JSON.parse(savedHistory) : [],
      }
    } catch (e) {
      console.error("ローカルストレージの読み込みに失敗しました:", e)
      return {
        attendanceList: null,
        selectedTare: null,
        workAllocation: {},
        isAllocated: false,
        allocationHistory: [],
      }
    }
  }

  // 初期状態
  const initialAttendanceList = [
    { id: "1", name: "尚", checked: false },
    { id: "2", name: "関口", checked: false },
    { id: "3", name: "荒井", checked: false },
    { id: "4", name: "優子", checked: false },
    { id: "5", name: "遠藤", checked: false },
    { id: "6", name: "清水", checked: false },
    { id: "7", name: "ポートン", checked: false },
    { id: "8", name: "サチコ", checked: false },
    { id: "9", name: "ハナ", checked: false },
    { id: "10", name: "マイ", checked: false },
    { id: "11", name: "萩原", checked: false },
    { id: "12", name: "箕輪", checked: false },
    { id: "13", name: "ヤー", checked: false },
    { id: "14", name: "林", checked: false },
    { id: "15", name: "マミ", checked: false },
    { id: "16", name: "よっちゃん", checked: false },
    { id: "17", name: "ノロ", checked: false },
    { id: "18", name: "ゆみこ", checked: false },
    { id: "19", name: "ゴン", checked: false },
    { id: "20", name: "クドウ", checked: false },
    { id: "21", name: "ユミ", checked: false },
  ]

  // ローカルストレージから読み込んだデータか初期値を使用
  const [attendanceList, setAttendanceList] = useState(initialAttendanceList)
  const [selectedTare, setSelectedTare] = useState({
    A: false,
    B: false,
    C: false,
  })

  const [workAllocation, setWorkAllocation] = useState({})
  const [isAllocated, setIsAllocated] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [allocationHistory, setAllocationHistory] = useState([])
  // 作業ごとの人数を表示するための状態
  const [taskCounts, setTaskCounts] = useState({})

  // メンバー編集関連の状態
  const [showMemberEditor, setShowMemberEditor] = useState(false)
  const [newMemberName, setNewMemberName] = useState("")
  const [editingMember, setEditingMember] = useState(null)

  // 履歴表示関連の状態
  const [showHistory, setShowHistory] = useState(false)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null)

  // パスワード関連の状態
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const correctPassword = "1234" // 実際の運用では強力なパスワードに変更してください

  // クライアントサイドでのみローカルストレージからデータを読み込む
  useEffect(() => {
    const savedData = loadFromLocalStorage()
    if (savedData.attendanceList) {
      // IDがない場合は追加する（既存データの互換性のため）
      const updatedList = savedData.attendanceList.map((member) => {
        if (!member.id) {
          return { ...member, id: Math.random().toString(36).substr(2, 9) }
        }
        return member
      })
      setAttendanceList(updatedList)
    }
    if (savedData.selectedTare) {
      setSelectedTare(savedData.selectedTare)
    }
    if (savedData.workAllocation) {
      setWorkAllocation(savedData.workAllocation)
      // 作業ごとの人数を計算
      const counts = {}
      Object.entries(savedData.workAllocation).forEach(([task, members]) => {
        counts[task] = members.length
      })
      setTaskCounts(counts)
    }
    if (savedData.isAllocated) {
      setIsAllocated(savedData.isAllocated)
    }
    if (savedData.allocationHistory) {
      setAllocationHistory(savedData.allocationHistory)
    }
  }, [])

  // 状態が変更されたらローカルストレージに保存
  useEffect(() => {
    try {
      localStorage.setItem("attendanceList", JSON.stringify(attendanceList))
      localStorage.setItem("selectedTare", JSON.stringify(selectedTare))
      localStorage.setItem("workAllocation", JSON.stringify(workAllocation))
      localStorage.setItem("isAllocated", JSON.stringify(isAllocated))
      localStorage.setItem("allocationHistory", JSON.stringify(allocationHistory))
    } catch (e) {
      console.error("ローカルストレージへの保存に失敗しました:", e)
    }
  }, [attendanceList, selectedTare, workAllocation, isAllocated, allocationHistory])

  const toggleAttendance = (id) => {
    // 割り当て後は変更不可（リセットが必要）
    if (isAllocated) return

    setAttendanceList((prev) =>
      prev.map((member) => (member.id === id ? { ...member, checked: !member.checked } : member)),
    )
  }

  const toggleTare = (type) => {
    // 割り当て後は変更不可（リセットが必要）
    if (isAllocated) return

    setSelectedTare((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const saveState = () => {
    try {
      localStorage.setItem("attendanceList", JSON.stringify(attendanceList))
      localStorage.setItem("selectedTare", JSON.stringify(selectedTare))
      localStorage.setItem("workAllocation", JSON.stringify(workAllocation))
      localStorage.setItem("isAllocated", JSON.stringify(isAllocated))
      localStorage.setItem("allocationHistory", JSON.stringify(allocationHistory))

      // 保存成功メッセージを表示して3秒後に消す
      setSaveMessage("保存しました！")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (e) {
      setSaveMessage("保存に失敗しました")
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  // リセットボタンを押したときの処理
  const handleResetClick = () => {
    // 割り当て後はパスワード確認
    if (isAllocated) {
      setShowPasswordModal(true)
    } else {
      // 割り当て前は直接リセット可能
      performReset()
    }
  }

  // パスワード確認後のリセット処理
  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setShowPasswordModal(false)
      setPassword("")
      setPasswordError("")
      performReset()
    } else {
      setPasswordError("パスワードが正しくありません")
    }
  }

  // 実際のリセット処理
  const performReset = () => {
    const resetAttendanceList = attendanceList.map((member) => ({
      ...member,
      checked: false,
    }))

    setAttendanceList(resetAttendanceList)
    setSelectedTare({
      A: false,
      B: false,
      C: false,
    })
    setWorkAllocation({})
    setIsAllocated(false)
    setTaskCounts({})

    // リセット状態を保存
    try {
      localStorage.setItem("attendanceList", JSON.stringify(resetAttendanceList))
      localStorage.setItem(
        "selectedTare",
        JSON.stringify({
          A: false,
          B: false,
          C: false,
        }),
      )
      localStorage.setItem("workAllocation", JSON.stringify({}))
      localStorage.setItem("isAllocated", JSON.stringify(false))
    } catch (e) {
      console.error("リセット状態の保存に失敗しました:", e)
    }
  }

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      // Use a temporary variable for swapping instead of destructuring
      const temp = shuffled[i]
      shuffled[i] = shuffled[j]
      shuffled[j] = temp
    }
    return shuffled
  }

  // allocateWork関数を修正します。
  const allocateWork = () => {
    // 出勤者の名前を取得
    const presentMembers = attendanceList.filter((member) => member.checked)
    const presentMemberNames = presentMembers.map((member) => member.name)

    // 固定メンバー
    const fixedMfgMembers = ["関口", "荒井", "萩原", "尚", "遠藤"]
    const saltSprinklerCandidates = ["関口", "荒井", "萩原", "尚", "優子", "箕輪", "ノロ", "ゴン"]

    // 作業担当者の割り当て
    // 固定メンバーを除いたその他の作業メンバー
    const otherWorkMembers = presentMemberNames.filter((name) => !fixedMfgMembers.includes(name))

    // 塩振り担当（特定のメンバーから選出）
    const saltSprinklerMembers = presentMemberNames.filter((name) => saltSprinklerCandidates.includes(name))

    // 入室チェック担当（製造メンバーからのみ1名をランダムに選出）
    const presentFixedMembers = fixedMfgMembers.filter((name) => presentMemberNames.includes(name))
    const entranceCheckMembers =
      presentFixedMembers.length > 0
        ? [presentFixedMembers[Math.floor(Math.random() * presentFixedMembers.length)]]
        : []

    // ここから白菜カットチームと他の作業を割り当て
    // 白菜カットは常に6名（Aチーム3名、Bチーム3名）
    const whiteCabbageTeamA = []
    const whiteCabbageTeamB = []

    // 白菜カットメンバーを選出（シャッフルして6名、または可能な限り）
    const shuffledOtherMembers = shuffleArray([...otherWorkMembers])
    const whiteCabbageMembers = shuffledOtherMembers.slice(0, Math.min(6, shuffledOtherMembers.length))

    // 白菜カットメンバーが6名未満の場合、警告メッセージを表示
    const whiteCabbageWarning =
      whiteCabbageMembers.length < 6
        ? `警告: 白菜カットメンバーが${whiteCabbageMembers.length}名しか確保できませんでした（目標: 6名）`
        : ""

    // 白菜カットメンバーをAチームとBチームに均等に分ける
    for (let i = 0; i < whiteCabbageMembers.length; i++) {
      if (i < Math.ceil(whiteCabbageMembers.length / 2)) {
        whiteCabbageTeamA.push(whiteCabbageMembers[i])
      } else {
        whiteCabbageTeamB.push(whiteCabbageMembers[i])
      }
    }

    // 他の作業の割り当て候補者（白菜カットメンバーも含む）
    // 白菜カットメンバーも他の作業に割り当て可能
    const otherTaskCandidates = [
      ...otherWorkMembers,
      ...whiteCabbageMembers.filter((name) => {
        // 塩振りメンバーの中の特定メンバーを追加（優子、ノロ、ゴン、箕輪）
        const specialSprinklers = ["優子", "箕輪", "ノロ", "ゴン"]
        return specialSprinklers.includes(name)
      }),
    ]

    // 重複を排除
    const uniqueOtherTaskCandidates = [...new Set(otherTaskCandidates)]

    // 他の作業メンバーをシャッフル
    const shuffledTaskCandidates = shuffleArray(uniqueOtherTaskCandidates)

    let niraCutMember = []
    const containerMembers = []
    const trashMembers = []
    let remainingCandidates = [...shuffledTaskCandidates]

    // ニラカット担当（ポートンさんが優先）
    if (presentMemberNames.includes("ポートン")) {
      niraCutMember = ["ポートン"]
      remainingCandidates = remainingCandidates.filter((name) => name !== "ポートン")
    } else if (remainingCandidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingCandidates.length)
      niraCutMember = [remainingCandidates[randomIndex]]
      remainingCandidates = remainingCandidates.filter((_, i) => i !== randomIndex)
    }

    // 容器出し担当（2名）
    // 修正：容器出しは2名のみを割り当てる
    for (let i = 0; i < 2 && i < remainingCandidates.length; i++) {
      const randomIndex = Math.floor(Math.random() * remainingCandidates.length)
      containerMembers.push(remainingCandidates[randomIndex])
      remainingCandidates = remainingCandidates.filter((_, j) => j !== randomIndex)
    }

    // ゴミ出し担当（1名）- 必ず1名割り当てる
    if (remainingCandidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingCandidates.length)
      trashMembers.push(remainingCandidates[randomIndex])
      remainingCandidates = remainingCandidates.filter((_, i) => i !== randomIndex)
    }

    // 残りはパッキング担当（余った人のみ、0人でもOK）
    // 他の作業に割り当てられていない人だけをパッキングに割り当てる
    const allAssignedMembers = [
      ...whiteCabbageTeamA,
      ...whiteCabbageTeamB,
      ...niraCutMember,
      ...containerMembers,
      ...trashMembers,
    ]

    // 他の作業に割り当てられていない人だけをパッキングに割り当てる
    const packingMembers = remainingCandidates.filter(
      (name) => !allAssignedMembers.includes(name) && !["箕輪", "ハナ", "マイ", "優子"].includes(name),
    )

    // タレの種類を表示用に整形
    const tareTypes = []
    if (selectedTare.A) tareTypes.push("A")
    if (selectedTare.B) tareTypes.push("B")
    if (selectedTare.C) tareTypes.push("C")

    const allocation = {
      製造: fixedMfgMembers.filter((name) => presentMemberNames.includes(name)),
      塩振り: saltSprinklerMembers,
      入室チェック: entranceCheckMembers,
      タレ: tareTypes, // タレの種類を直接表示
      白菜カットAチーム: whiteCabbageTeamA,
      白菜カットBチーム: whiteCabbageTeamB,
      ニラカット: niraCutMember,
      容器出し: containerMembers,
      ゴミ出し: trashMembers,
      パッキング: packingMembers, // 余った人のみ（0人の場合もあり）
    }

    // 警告メッセージがある場合は追加
    if (whiteCabbageWarning) {
      allocation["警告"] = [whiteCabbageWarning]
    }

    // 作業ごとの人数を計算
    const counts = {}
    Object.entries(allocation).forEach(([task, members]) => {
      counts[task] = members.length
    })
    setTaskCounts(counts)

    setWorkAllocation(allocation)
    setIsAllocated(true)

    // 履歴に追加
    const historyItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("ja-JP"),
      timestamp: Date.now(),
      attendanceList: [...attendanceList],
      selectedTare: { ...selectedTare },
      workAllocation: allocation,
      taskCounts: counts,
    }

    setAllocationHistory((prev) => [historyItem, ...prev])

    // 割り当て結果を自動で保存
    try {
      localStorage.setItem("workAllocation", JSON.stringify(allocation))
      localStorage.setItem("isAllocated", JSON.stringify(true))
      localStorage.setItem("allocationHistory", JSON.stringify([historyItem, ...allocationHistory]))
    } catch (e) {
      console.error("割り当て結果の保存に失敗しました:", e)
    }
  }

  // 結果をテキスト形式に変換
  const formatResultForSharing = (allocation = workAllocation, counts = taskCounts) => {
    if (Object.keys(allocation).length === 0) return ""

    let result = "【作業割り当て結果】\n\n"

    Object.entries(allocation).forEach(([workType, members]) => {
      // 人数を表示（タレ以外）
      const countText = !workType.includes("タレ") && members.length > 0 ? `（${members.length}名）` : ""

      result += `■${workType}${countText}\n`

      if (workType === "タレ") {
        if (members.length > 0) {
          members.forEach((type) => {
            result += `・タレ${type}\n`
          })
        } else {
          result += "・タレなし\n"
        }
      } else if (members.length > 0) {
        members.forEach((name) => {
          result += `・${name}\n`
        })
      } else {
        result += "・担当者なし\n"
      }
      result += "\n"
    })

    return result
  }

  // 結果をクリップボードにコピー
  const copyResultToClipboard = (allocation = workAllocation, counts = taskCounts) => {
    const text = formatResultForSharing(allocation, counts)

    // フォールバック方法を使用
    try {
      // モダンなClipboard APIを試す
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            setSaveMessage("結果をコピーしました！")
            setTimeout(() => setSaveMessage(""), 3000)
          })
          .catch((err) => {
            console.error("Clipboard API failed:", err)
            fallbackCopyTextToClipboard(text)
          })
      } else {
        // Clipboard APIが利用できない場合はフォールバック
        fallbackCopyTextToClipboard(text)
      }
    } catch (err) {
      console.error("クリップボードへのコピーに失敗しました:", err)
      setSaveMessage("コピーに失敗しました")
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  // フォールバックのコピー方法
  const fallbackCopyTextToClipboard = (text) => {
    try {
      // 一時的なテキストエリアを作成
      const textArea = document.createElement("textarea")
      textArea.value = text

      // テキストエリアをスクロール外に配置
      textArea.style.position = "fixed"
      textArea.style.top = "-999999px"
      textArea.style.left = "-999999px"
      document.body.appendChild(textArea)

      // テキストを選択してコピー
      textArea.focus()
      textArea.select()

      const successful = document.execCommand("copy")
      document.body.removeChild(textArea)

      if (successful) {
        setSaveMessage("結果をコピーしました！")
      } else {
        setSaveMessage("コピーに失敗しました。テキストを手動で選択してコピーしてください。")
        // テキストを表示するモーダルを表示
        showTextModal(text)
      }
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (err) {
      console.error("フォールバックコピー方法も失敗:", err)
      setSaveMessage("コピーに失敗しました。テキストを手動でコピーしてください。")
      // テキストを表示するモーダルを表示
      showTextModal(text)
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  // テキストを表示するモーダル用の状態を追加
  const [showTextModalState, setShowTextModalState] = useState(false)
  const [modalText, setModalText] = useState("")

  // テキストを表示するモーダルを表示する関数
  const showTextModal = (text) => {
    setModalText(text)
    setShowTextModalState(true)
  }

  // テキストモーダルを閉じる関数
  const closeTextModal = () => {
    setShowTextModalState(false)
    setModalText("")
  }

  // メンバー追加
  const addMember = () => {
    if (!newMemberName.trim()) return

    const newMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      checked: false,
    }

    setAttendanceList((prev) => [...prev, newMember])
    setNewMemberName("")
  }

  // メンバー編集
  const updateMember = () => {
    if (!editingMember || !editingMember.name.trim()) return

    setAttendanceList((prev) =>
      prev.map((member) => (member.id === editingMember.id ? { ...member, name: editingMember.name } : member)),
    )
    setEditingMember(null)
  }

  // メンバー削除
  const deleteMember = (id) => {
    setAttendanceList((prev) => prev.filter((member) => member.id !== id))
  }

  // 履歴項目を選択
  const selectHistoryItem = (item) => {
    setSelectedHistoryItem(item)
    // 履歴の作業ごとの人数を設定
    if (item.taskCounts) {
      setTaskCounts(item.taskCounts)
    } else {
      // 古い履歴データの場合は人数を計算
      const counts = {}
      Object.entries(item.workAllocation).forEach(([task, members]) => {
        counts[task] = members.length
      })
      setTaskCounts(counts)
    }
  }

  // 履歴から削除
  const deleteHistoryItem = (id) => {
    setAllocationHistory((prev) => prev.filter((item) => item.id !== id))
    if (selectedHistoryItem?.id === id) {
      setSelectedHistoryItem(null)
      setTaskCounts({})
    }
  }

  // メイン画面表示
  if (showMemberEditor) {
    return (
      <div className="p-4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowMemberEditor(false)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            戻る
          </button>
          <h1 className="text-2xl font-bold text-blue-700">メンバー管理</h1>
          <div></div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="新しいメンバー名"
              className="flex-1 p-3 border rounded-l-lg"
            />
            <button
              onClick={addMember}
              className="bg-green-600 text-white px-4 py-3 rounded-r-lg flex items-center hover:bg-green-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              追加
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">メンバー一覧</h2>
            <div className="space-y-2">
              {attendanceList.map((member) => (
                <div key={member.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                  {editingMember?.id === member.id ? (
                    <div className="flex-1 flex items-center">
                      <input
                        type="text"
                        value={editingMember.name}
                        onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                        className="flex-1 p-2 border rounded-lg mr-2"
                        autoFocus
                      />
                      <button
                        onClick={updateMember}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => setEditingMember(null)}
                        className="bg-gray-200 text-gray-700 p-2 rounded-lg ml-2 hover:bg-gray-300"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-lg">{member.name}</span>
                      <div className="flex items-center">
                        <button
                          onClick={() => setEditingMember(member)}
                          className="text-blue-600 p-2 rounded-lg hover:bg-blue-100"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteMember(member.id)}
                          className="text-red-600 p-2 rounded-lg hover:bg-red-100"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 履歴画面表示
  if (showHistory) {
    return (
      <div className="p-4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => {
              setShowHistory(false)
              setSelectedHistoryItem(null)
            }}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            戻る
          </button>
          <h1 className="text-2xl font-bold text-blue-700">割り当て履歴</h1>
          <div></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">履歴一覧</h2>
            {allocationHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-4">履歴がありません</p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {allocationHistory.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                      selectedHistoryItem?.id === item.id ? "bg-blue-50 border-blue-300" : "bg-white"
                    }`}
                    onClick={() => selectHistoryItem(item)}
                  >
                    <div className="flex items-center">
                      <Clock size={18} className="mr-2 text-gray-600" />
                      <span>{item.date}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteHistoryItem(item.id)
                      }}
                      className="text-red-600 p-1 rounded-lg hover:bg-red-100"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {selectedHistoryItem ? (
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{selectedHistoryItem.date}の割り当て</h3>
                  <button
                    onClick={() => copyResultToClipboard(selectedHistoryItem.workAllocation, taskCounts)}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg flex items-center hover:bg-blue-200 transition-colors"
                  >
                    結果をコピー
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(selectedHistoryItem.workAllocation).map(([workType, members]) => (
                    <div key={workType} className="mb-3">
                      <h4 className="font-medium text-gray-800 mb-1">
                        {workType}
                        {!workType.includes("タレ") && members.length > 0 && (
                          <span className="text-blue-600 ml-2">（{members.length}名）</span>
                        )}
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg border">
                        {workType === "タレ" ? (
                          members.length > 0 ? (
                            <ul className="list-disc pl-6 text-lg">
                              {members.map((type, i) => (
                                <li key={i} className="py-1">
                                  タレ{type}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 text-lg">タレなし</p>
                          )
                        ) : members.length > 0 ? (
                          <ul className="list-disc pl-5">
                            {members.map((name, i) => (
                              <li key={i} className="py-1">
                                {name}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">担当者なし</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-800 mb-2">出席メンバー</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHistoryItem.attendanceList
                      .filter((member) => member.checked)
                      .map((member) => (
                        <span key={member.id} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {member.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg border flex items-center justify-center h-full">
                <p className="text-gray-500">履歴を選択してください</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // メイン画面表示
  return (
    <div className="p-4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">作業割り当てアプリ 【{nextDate}】</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors"
        >
          🔄 アプリを更新
        </button>
      </div>

      {/* タブレット向けの上部アクションボタン */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={saveState}
            className="bg-green-600 text-white px-4 py-3 rounded-lg flex items-center hover:bg-green-700 transition-colors"
          >
            <Save size={20} className="mr-2" />
            保存
          </button>

          <button
            onClick={() => setShowMemberEditor(true)}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Edit size={20} className="mr-2" />
            メンバー編集
          </button>
        </div>

        <div className="text-center">
          {saveMessage && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg animate-pulse">{saveMessage}</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(true)}
            className="bg-purple-100 text-purple-700 px-4 py-3 rounded-lg flex items-center hover:bg-purple-200 transition-colors"
            disabled={allocationHistory.length === 0}
          >
            <Clock size={20} className="mr-2" />
            履歴
          </button>

          <button
            onClick={handleResetClick}
            className="bg-red-100 text-red-700 px-4 py-3 rounded-lg flex items-center hover:bg-red-200 transition-colors"
          >
            <RotateCcw size={20} className="mr-2" />
            リセット
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center">
          <User size={22} className="mr-2 text-blue-600" />
          出勤者を選択
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {attendanceList.map((member) => (
            <button
              key={member.id}
              onClick={() => toggleAttendance(member.id)}
              disabled={isAllocated}
              className={`p-4 rounded-lg flex items-center justify-between text-lg ${
                member.checked ? "bg-green-100 border-green-500 font-medium" : "bg-gray-100"
              } border-2 transition-colors ${isAllocated ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-200 active:scale-95 transform"}`}
            >
              <span className="flex items-center">
                <User size={20} className="mr-2 text-gray-600" />
                {member.name}
              </span>
              {member.checked && <Check size={24} className="text-green-600" />}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center">
          <Coffee size={22} className="mr-2 text-purple-600" />
          本日のタレを選択
        </h2>
        <div className="flex flex-wrap gap-4 mb-8">
          {/* ✅ タレA */}
          <button
            onClick={() => toggleTare("A")}
            disabled={isAllocated}
            className={`flex items-center px-6 py-3 rounded-lg text-lg font-semibold
    ${selectedTare.A ? "bg-blue-600 text-white border-blue-700" : "bg-gray-100 text-gray-700"} 
    border-2 shadow-sm hover:shadow-md transition-all`}
          >
            <Coffee size={24} className="mr-3" />
            タレA
          </button>

          {/* ✅ タレB */}
          <button
            onClick={() => toggleTare("B")}
            disabled={isAllocated}
            className={`flex items-center px-6 py-3 rounded-lg text-lg font-semibold
    ${selectedTare.B ? "bg-green-600 text-white border-green-700" : "bg-gray-100 text-gray-700"} 
    border-2 shadow-sm hover:shadow-md transition-all`}
          >
            <Coffee size={24} className="mr-3" />
            タレB
          </button>

          {/* ✅ タレC */}
          <button
            onClick={() => toggleTare("C")}
            disabled={isAllocated}
            className={`flex items-center px-6 py-3 rounded-lg text-lg font-semibold
    ${selectedTare.C ? "bg-purple-600 text-white border-purple-700" : "bg-gray-100 text-gray-700"} 
    border-2 shadow-sm hover:shadow-md transition-all`}
          >
            <Coffee size={24} className="mr-3" />
            タレC
          </button>
        </div>

        {/* ✅ LINE送信ボタン */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => sendLineNotification(formatResultForSharing())}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all"
          >
            LINEに送信
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={allocateWork}
          disabled={attendanceList.filter((m) => m.checked).length === 0 || isAllocated}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center hover:bg-blue-700 transition-colors active:scale-95 transform"
        >
          <span>作業を割り当てる</span>
          <ChevronRight size={24} className="ml-2" />
        </button>
      </div>

      {isAllocated && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">作業割り当て結果</h2>
            <button
              onClick={() => copyResultToClipboard()}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center hover:bg-blue-200 transition-colors"
            >
              結果をコピー
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(workAllocation).map(([workType, members]) => (
              <div key={workType} className="mb-4">
                <h3 className="font-medium text-lg text-gray-800 mb-2">
                  {workType}
                  {!workType.includes("タレ") && members.length > 0 && (
                    <span className="text-blue-600 ml-2">（{members.length}名）</span>
                  )}
                </h3>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  {workType === "タレ" ? (
                    members.length > 0 ? (
                      <ul className="list-disc pl-6 text-lg">
                        {members.map((type, i) => (
                          <li key={i} className="py-1">
                            タレ{type}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-lg">タレなし</p>
                    )
                  ) : members.length > 0 ? (
                    <ul className="list-disc pl-6 text-lg">
                      {members.map((name, i) => (
                        <li key={i} className="py-1">
                          {name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-lg">担当者なし</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* パスワード確認モーダル */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center mb-4">
              <Lock size={24} className="mr-2 text-blue-600" />
              <h3 className="text-xl font-semibold">パスワード確認</h3>
            </div>

            <p className="mb-4 text-gray-700">割り当て後のリセットにはパスワードが必要です。</p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              className="w-full p-3 border rounded-lg mb-4"
              autoFocus
            />

            {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setPassword("")
                  setPasswordError("")
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                キャンセル
              </button>

              <button
                onClick={handlePasswordSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                確認
              </button>
            </div>
          </div>
        </div>
      )}
      {/* テキスト表示モーダル */}
      {showTextModalState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">結果テキスト</h3>
              <button onClick={closeTextModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border mb-4 max-h-[60vh] overflow-y-auto">
              <pre className="whitespace-pre-wrap">{modalText}</pre>
            </div>

            <p className="text-sm text-gray-600 mb-4">上記のテキストを選択して手動でコピーしてください。</p>

            <div className="flex justify-end">
              <button
                onClick={closeTextModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// sendLineNotification関数を定義
const sendLineNotification = async (message) => {
  const groupId = process.env.NEXT_PUBLIC_GROUP_ID
  const token = process.env.NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN

  if (!token || !groupId) {
    alert("LINE通知の設定が不足しています。")
    return
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }

  const body = JSON.stringify({
    to: groupId,
    messages: [{ type: "text", text: message }],
  })

  try {
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers,
      body,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("LINE送信エラー:", errorText)
      alert("LINE通知に失敗しました")
    } else {
      alert("LINE通知を送信しました！")
    }
  } catch (error) {
    console.error("LINE通知送信中の例外:", error)
    alert("LINE通知の送信に失敗しました。")
  }
}

export default WorkAllocationApp

