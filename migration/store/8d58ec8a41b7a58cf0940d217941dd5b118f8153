package ru.swiftail.dataobjects.api.exceptions;

import java.util.StringJoiner;

public abstract class DataObjectsException extends Exception {

    public DataObjectsException(String message, Throwable cause) {
        super(message, cause);
    }

    public DataObjectsException(Throwable cause) {
        super(cause);
    }

    public DataObjectsException(String message) {
        super(message);
    }

    @Override
    public String toString() {
        return new StringJoiner(", ", this.getClass().getSimpleName() + "[", "]")
                .add("message=" + this.getMessage())
                .add("cause=" + this.getCause())
                .toString();
    }
}
