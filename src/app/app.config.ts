export const cfg = {
    apiUrl: "http://test.back.dream-of-sports.com/api/mainsite",
    baseUrl: "http://localhost:4200",
    wsUrl: "wss://test.back.dream-of-sports.com/socket",
    supabaseUrl: "https://qqqjpngdspwjtashdlsa.supabase.co/storage/v1/object/public",
    maxImageFileSize: 10000000,
    maxVideoFileSize: 50000000,
    maxOtherFileSize: 10000000,
    maxAnyFileSize: 10000000,
    allowedImageTypes: [
        "image/jpeg", 
        "image/png",
        "image/gif",
        "image/svg+xml",
    ],
    allowedVideoTypes: [
        "video/mp4", 
    ],
    allowedOtherTypes: [
        "text/plain",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
};
