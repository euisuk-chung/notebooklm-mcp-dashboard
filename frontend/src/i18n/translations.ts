export const translations: Record<string, { ko: string; en: string }> = {
  // Header
  "header.connected": { ko: "연결됨", en: "Connected" },
  "header.title": { ko: "NotebookLM Dashboard", en: "NotebookLM Dashboard" },

  // Notebooks page
  "notebooks.loadError": { ko: "노트북을 불러올 수 없습니다", en: "Failed to load notebooks" },
  "notebooks.authExpired": { ko: "인증이 만료되었을 수 있습니다. 터미널에서", en: "Authentication may have expired. Run" },
  "notebooks.retry": { ko: "다시 시도", en: "Retry" },
  "notebooks.cleanup": { ko: "정리 제안", en: "Cleanup Suggestions" },
  "notebooks.empty": { ko: "노트북이 없습니다", en: "No notebooks" },
  "notebooks.emptyHint": { ko: "MCP를 통해 노트북을 생성해보세요", en: "Create notebooks via MCP" },
  "notebooks.count": { ko: "{count}개", en: "{count}" },

  // Toolbar
  "toolbar.search": { ko: "노트북 검색...", en: "Search notebooks..." },
  "toolbar.newNotebook": { ko: "새 노트북", en: "New Notebook" },
  "toolbar.rangeSelect": { ko: "구간 선택", en: "Range" },
  "toolbar.rangeSelecting": { ko: "구간 선택 중", en: "Selecting" },
  "toolbar.refresh": { ko: "새로고침", en: "Refresh" },
  "toolbar.sortModified": { ko: "수정일", en: "Modified" },
  "toolbar.sortCreated": { ko: "생성일", en: "Created" },
  "toolbar.sortName": { ko: "이름", en: "Name" },
  "toolbar.sortSources": { ko: "소스 수", en: "Sources" },
  "toolbar.list": { ko: "리스트", en: "List" },
  "toolbar.card": { ko: "카드", en: "Cards" },
  "toolbar.table": { ko: "테이블", en: "Table" },
  "toolbar.descending": { ko: "내림차순", en: "Descending" },
  "toolbar.ascending": { ko: "오름차순", en: "Ascending" },

  // Bulk actions
  "bulk.selected": { ko: "{count}개 선택됨", en: "{count} selected" },
  "bulk.selectAll": { ko: "전체 선택", en: "Select All" },
  "bulk.deselectAll": { ko: "선택 해제", en: "Deselect All" },
  "bulk.createContent": { ko: "콘텐츠 생성", en: "Create Content" },
  "bulk.deleteSelected": { ko: "선택 삭제", en: "Delete Selected" },
  "bulk.deleteTitle": { ko: "노트북 삭제", en: "Delete Notebooks" },
  "bulk.deleteMessage": { ko: "선택한 {count}개의 노트북을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.", en: "Delete {count} selected notebooks? This cannot be undone." },

  // Usage
  "usage.loading": { ko: "사용량 로딩 중...", en: "Loading usage..." },
  "usage.title": { ko: "노트북 사용량", en: "Notebook Usage" },
  "usage.almostFull": { ko: "용량이 거의 찼습니다", en: "Almost at capacity" },

  // Cleanup
  "cleanup.title": { ko: "정리 제안", en: "Cleanup Suggestions" },
  "cleanup.deleteAll": { ko: "전체 삭제", en: "Delete All" },
  "cleanup.description": { ko: "오랫동안 사용하지 않은 노트북입니다", en: "Notebooks not used for a long time" },
  "cleanup.confirmTitle": { ko: "전체 정리", en: "Clean Up All" },
  "cleanup.confirmMessage": { ko: "제안된 {count}개의 노트북을 모두 삭제하시겠습니까?", en: "Delete all {count} suggested notebooks?" },

  // Detail page
  "detail.back": { ko: "노트북 목록", en: "Notebook List" },
  "detail.backToList": { ko: "목록으로 돌아가기", en: "Back to list" },
  "detail.loadError": { ko: "노트북을 불러올 수 없습니다", en: "Failed to load notebook" },
  "detail.openNotebookLM": { ko: "NotebookLM에서 열기", en: "Open in NotebookLM" },
  "detail.sources": { ko: "소스 ({count})", en: "Sources ({count})" },
  "detail.noSources": { ko: "소스가 없습니다", en: "No sources" },

  // Create notebook dialog
  "create.title": { ko: "새 노트북 만들기", en: "Create New Notebook" },
  "create.placeholder": { ko: "노트북 제목을 입력하세요", en: "Enter notebook title" },
  "create.error": { ko: "노트북 생성에 실패했습니다", en: "Failed to create notebook" },
  "create.cancel": { ko: "취소", en: "Cancel" },
  "create.submit": { ko: "만들기", en: "Create" },

  // Query panel
  "query.title": { ko: "노트북 질문하기", en: "Ask Notebook" },
  "query.placeholder": { ko: "질문을 입력하세요...", en: "Enter your question..." },
  "query.submit": { ko: "질문하기", en: "Ask" },
  "query.error": { ko: "질문 처리 중 오류가 발생했습니다.", en: "Error processing question." },
  "query.loading": { ko: "답변 생성 중...", en: "Generating answer..." },

  // Source panel
  "source.addTitle": { ko: "소스 추가 / 웹 리서치", en: "Add Source / Research" },
  "source.url": { ko: "URL", en: "URL" },
  "source.youtube": { ko: "YouTube", en: "YouTube" },
  "source.text": { ko: "텍스트", en: "Text" },
  "source.research": { ko: "웹 리서치", en: "Research" },
  "source.pipeline": { ko: "파이프라인", en: "Pipeline" },
  "source.urlPlaceholder": { ko: "URL을 입력하세요 (여러 개는 줄바꿈으로 구분)", en: "Enter URLs (one per line for batch)" },
  "source.urlAdding": { ko: "{count}개 URL 추가 중...", en: "Adding {count} URLs..." },
  "source.urlHint": { ko: "URL을 입력하면 자동으로 내용을 분석합니다", en: "URLs will be automatically analyzed" },
  "source.add": { ko: "추가", en: "Add" },
  "source.added": { ko: "소스가 추가되었습니다", en: "Source added" },
  "source.addFailed": { ko: "추가 실패. URL을 확인해주세요.", en: "Failed to add. Check the URL." },
  "source.ytPlaceholder": { ko: "https://www.youtube.com/watch?v=...", en: "https://www.youtube.com/watch?v=..." },
  "source.ytHint": { ko: "YouTube 영상의 자막을 소스로 추가합니다", en: "Add YouTube video subtitles as source" },
  "source.ytFailed": { ko: "추가 실패. YouTube URL을 확인해주세요.", en: "Failed. Check the YouTube URL." },
  "source.textTitle": { ko: "소스 제목 (선택)", en: "Source title (optional)" },
  "source.textPlaceholder": { ko: "텍스트 내용을 입력하세요...", en: "Enter text content..." },
  "source.textFailed": { ko: "추가 실패", en: "Failed to add" },
  "source.researchPlaceholder": { ko: "검색할 주제를 입력하세요...", en: "Enter research topic..." },
  "source.researchFast": { ko: "빠른 검색 (~30초, ~10개)", en: "Fast (~30s, ~10 sources)" },
  "source.researchDeep": { ko: "심층 검색 (~5분, ~40개)", en: "Deep (~5min, ~40 sources)" },
  "source.researchWeb": { ko: "웹 검색", en: "Web" },
  "source.researchDrive": { ko: "Google Drive", en: "Google Drive" },
  "source.researchStart": { ko: "리서치 시작", en: "Start Research" },
  "source.researchImport": { ko: "결과 가져오기", en: "Import Results" },
  "source.researchStarted": { ko: "리서치가 시작되었습니다. 완료 후 \"결과 가져오기\"를 클릭하세요.", en: "Research started. Click \"Import Results\" when done." },
  "source.researchImported": { ko: "리서치 결과가 소스로 추가되었습니다", en: "Research results imported as sources" },
  "source.researchError": { ko: "오류가 발생했습니다. 다시 시도해주세요.", en: "An error occurred. Please try again." },
  "source.pipelineUrl2Podcast": { ko: "URL → 팟캐스트", en: "URL → Podcast" },
  "source.pipelineResearch2Report": { ko: "리서치 → 리포트", en: "Research → Report" },
  "source.pipelineMulti": { ko: "전체 콘텐츠", en: "All Content" },
  "source.pipelineHint": { ko: "URL 입력부터 콘텐츠 생성까지 한 번에 실행합니다", en: "Run from URL input to content generation in one step" },
  "source.pipelineRun": { ko: "실행", en: "Run" },
  "source.pipelineRunning": { ko: "파이프라인 실행 중...", en: "Running pipeline..." },
  "source.pipelineStarted": { ko: "파이프라인이 시작되었습니다", en: "Pipeline started" },
  "source.pipelineFailed": { ko: "파이프라인 실행 실패. URL을 확인해주세요.", en: "Pipeline failed. Check the URL." },

  // Studio
  "studio.title": { ko: "Content Studio", en: "Content Studio" },
  "studio.description": { ko: "노트북의 내용을 다양한 형태로 변환합니다", en: "Transform notebook content into various formats" },
  "studio.generated": { ko: "생성된 콘텐츠", en: "Generated Content" },
  "studio.empty": { ko: "생성된 콘텐츠가 없습니다", en: "No generated content" },
  "studio.emptyHint": { ko: "위에서 유형을 선택하여 콘텐츠를 생성해보세요", en: "Select a type above to create content" },
  "studio.create": { ko: "생성하기", en: "Create" },
  "studio.cancel": { ko: "취소", en: "Cancel" },
  "studio.download": { ko: "다운로드", en: "Download" },
  "studio.delete": { ko: "삭제", en: "Delete" },
  "studio.generating": { ko: "{label} 생성", en: "Create {label}" },

  // Artifact option labels
  "option.formats": { ko: "포맷", en: "Format" },
  "option.styles": { ko: "스타일", en: "Style" },
  "option.length": { ko: "길이", en: "Length" },
  "option.difficulty": { ko: "난이도", en: "Difficulty" },
  "option.question_count": { ko: "문제 수", en: "Questions" },
  "option.orientation": { ko: "방향", en: "Orientation" },
  "option.description": { ko: "설명", en: "Description" },
  "option.focus": { ko: "포커스", en: "Focus" },

  // Artifact types
  "artifact.audio": { ko: "팟캐스트", en: "Podcast" },
  "artifact.audio.desc": { ko: "AI 호스트의 대화형 오디오", en: "Conversational audio with AI hosts" },
  "artifact.video": { ko: "영상", en: "Video" },
  "artifact.video.desc": { ko: "시각적 설명 영상", en: "Visual explainer video" },
  "artifact.report": { ko: "리포트", en: "Report" },
  "artifact.report.desc": { ko: "구조화된 텍스트 리포트", en: "Structured text report" },
  "artifact.quiz": { ko: "퀴즈", en: "Quiz" },
  "artifact.quiz.desc": { ko: "객관식 퀴즈", en: "Multiple choice quiz" },
  "artifact.flashcards": { ko: "플래시카드", en: "Flashcards" },
  "artifact.flashcards.desc": { ko: "학습용 플래시카드", en: "Study flashcards" },
  "artifact.mind_map": { ko: "마인드맵", en: "Mind Map" },
  "artifact.mind_map.desc": { ko: "핵심 개념 시각화", en: "Visualize key concepts" },
  "artifact.slide_deck": { ko: "슬라이드", en: "Slides" },
  "artifact.slide_deck.desc": { ko: "프레젠테이션 슬라이드", en: "Presentation slides" },
  "artifact.infographic": { ko: "인포그래픽", en: "Infographic" },
  "artifact.infographic.desc": { ko: "시각적 정보 요약", en: "Visual information summary" },
  "artifact.data_table": { ko: "데이터테이블", en: "Data Table" },
  "artifact.data_table.desc": { ko: "구조화된 데이터 표", en: "Structured data table" },

  // Badge statuses
  "status.pending": { ko: "대기중", en: "Pending" },
  "status.generating": { ko: "생성중", en: "Generating" },
  "status.completed": { ko: "완료", en: "Complete" },
  "status.failed": { ko: "실패", en: "Failed" },

  // Common
  "common.delete": { ko: "삭제", en: "Delete" },
  "common.cancel": { ko: "취소", en: "Cancel" },
  "common.confirm": { ko: "확인", en: "Confirm" },
  "common.noDate": { ko: "날짜 없음", en: "No date" },
  "common.untitled": { ko: "(제목 없음)", en: "(Untitled)" },
  "common.sources": { ko: "소스 {count}개", en: "{count} sources" },

  // Time
  "time.justNow": { ko: "방금 전", en: "Just now" },
  "time.minutesAgo": { ko: "{n}분 전", en: "{n}m ago" },
  "time.hoursAgo": { ko: "{n}시간 전", en: "{n}h ago" },
  "time.daysAgo": { ko: "{n}일 전", en: "{n}d ago" },
  "time.weeksAgo": { ko: "{n}주 전", en: "{n}w ago" },

  // Delete dialog
  "delete.title": { ko: "노트북 삭제", en: "Delete Notebook" },
  "delete.message": { ko: "이 노트북을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.", en: "Delete this notebook? This cannot be undone." },

  // Table headers
  "table.select": { ko: "선택", en: "Select" },
  "table.title": { ko: "제목", en: "Title" },
  "table.sources": { ko: "소스", en: "Sources" },
  "table.tags": { ko: "태그", en: "Tags" },
  "table.created": { ko: "생성일", en: "Created" },
  "table.actions": { ko: "액션", en: "Actions" },
};
