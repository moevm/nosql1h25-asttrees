package ru.swiftail.dataobjects.api.result;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.NoSuchElementException;
import java.util.StringJoiner;

class ResultOk<R,E> extends Result<R,E> {

    private final R value;

    public ResultOk(R value) {
        this.value = value;
    }
    
    @Override
    public boolean isError() {
        return false;
    }

    @NotNull
    @Override
    public E unsafeGetError() throws NoSuchElementException {
        throw new NoSuchElementException("unsafeGetError() called on ResultOk");
    }

    @Nullable
    @Override
    public R unsafeGet() throws NoSuchElementException {
        return value;
    }

    @Override
    public String toString() {
        return new StringJoiner(", ", ResultOk.class.getSimpleName() + "[", "]")
                .add("value=" + value)
                .toString();
    }
}
