package in.suniye.app;
/** Only app-authored Hindi messages may be shown or spoken from an exception. */
public final class UserMessage extends Exception {
 public UserMessage(String message){super(message);}
 public static String display(Exception error,String fallback){return error instanceof UserMessage?error.getMessage():fallback;}
}
