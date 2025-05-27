package ru.swiftail.dataobjects.api.result;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.NoSuchElementException;
import java.util.StringJoiner;

class ResultError<R, E> extends Result<R, E> {

    private final E error;

    public ResultError(E error) {
        this.error = error;
    }

    @Override
    public boolean isError() {
        return true;
    }

    @NotNull
    @Override
    public E unsafeGetError() throws NoSuchElementException {
        return error;
    }

    @Nullable
    @Override
    public R unsafeGet() throws NoSuchElementException {
        throw new NoSuchElementException("unsafeGet() called on " + this);
    }

    @Override
    public String toString() {
        return new StringJoiner(", ", ResultError.class.getSimpleName() + "[", "]")
                .add("error=" + error)
                .toString();
    }
}
