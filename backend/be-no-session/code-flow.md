route => controller => service

kịch bản :
- User đăng ký xong account thì họ vẫn có thể login mà không cần verify account thông qua email.
- user đăng nhập :
    + ok
        => trả về mess báo thành công + đnh kèm token (httpOnly)
        => ngay lúc đó client sẽ gọi api "/user" - "getUser" để lấy thông tin người dùng, trả lên cho client
