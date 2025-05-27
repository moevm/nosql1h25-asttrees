package ru.swiftail.dataobjects.api.result;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.Collections;
import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

public abstract class Result<R, E> implements Iterable<R> {

    /**
     * @param value     Origin value
     * @param lazyError Error producer, to be used if value == null
     * @return - ResultError(lazyError.get()) if value == null
     * - ResultOk(value) if value is ok
     */
    @NotNull
    public static <R, E> Result<R, E> ofNullable(@Nullable R value, @NotNull Supplier<E> lazyError) {
        return value == null ?
                error(lazyError.get()) :
                ok(value);
    }

    public static <E> Result<Void, E> okVoid() {
        return ResultOkVoid.instance();
    }

    @SuppressWarnings("ConstantConditions")
    @NotNull
    public static <R, E> Result<R, E> ok(@NotNull R value) {
        assert value != null : "Result value should not be null";
        return new ResultOk<R, E>(value);
    }

    @SuppressWarnings("ConstantConditions")
    @NotNull
    public static <R, E> Result<R, E> error(@NotNull E error) {
        assert error != null : "Error value should not be null";
        return new ResultError<R, E>(error);
    }

    /**
     * @return if value is error
     */
    public abstract boolean isError();

    /**
     * @return if value is ok
     */
    public boolean isOk() {
        return !isError();
    }

    /**
     * @return Error if it exists
     * @throws NoSuchElementException if result is ok
     */
    @NotNull
    public abstract E unsafeGetError() throws NoSuchElementException;

    /**
     * @return Value if it exists
     * @throws NoSuchElementException if result is error
     */
    @Nullable
    public abstract R unsafeGet() throws NoSuchElementException;

    @NotNull
    @Override
    public Iterator<R> iterator() {
        return isError() ? Collections.emptyIterator() : Collections.singleton(unsafeGet()).iterator();
    }

    /**
     * @return Iterator<E>, that is:
     * - Empty is result is ok
     * - Or contains single error element
     */
    @NotNull
    public Iterator<E> errorIterator() {
        return isError() ? Collections.singleton(unsafeGetError()).iterator() : Collections.emptyIterator();
    }

    /**
     * Converts Result<R,?> to Optional<R>
     *
     * @return Optional(value) if value exists, or Optional.empty()
     */
    @NotNull
    public Optional<R> asOptional() {
        return isError() ? Optional.empty() : Optional.of(unsafeGet());
    }

    /**
     * @param fallback value to return if result is error
     * @return value if it exists, or fallback
     */
    public R orElse(R fallback) {
        return isError() ? fallback : unsafeGet();
    }

    /**
     * @param lazyFallback supplier of value to return if result is error
     * @return value if it exists, or fallback
     */
    @Nullable
    public R orElseGet(@NotNull Supplier<R> lazyFallback) {
        return isError() ? lazyFallback.get() : unsafeGet();
    }

    public R require() throws IllegalStateException {
        return unsafeGet();
    }

    /**
     * Returns ResultOk containing the result of applying
     * mapper to value if this result is ok.
     * Otherwise returns this result (error)
     *
     * @param mapper the function to apply
     */
    @NotNull
    @SuppressWarnings("unchecked")
    public <R2> Result<R2, E> map(@NotNull Function<R, R2> mapper) {
        return isError() ? (Result<R2, E>) this : ok(mapper.apply(unsafeGet()));
    }

    /**
     * Returns ResultOk containing the result of running
     * supplied function if this result is ok.
     * Otherwise returns this result (error)
     *
     * @param function the function to run
     */
    @NotNull
    @SuppressWarnings("unchecked")
    public <R2> Result<R2, E> then(@NotNull Supplier<R2> function) {
        return isError() ? (Result<R2, E>) this : ok(function.get());
    }

    /**
     * Returns the result of applying
     * mapper to value if this result is ok.
     * Otherwise returns this result (error)
     *
     * @param mapper the function to apply
     */
    @NotNull
    @SuppressWarnings("unchecked")
    public <R2> Result<R2, E> flatMap(@NotNull Function<R, Result<R2, E>> mapper) {
        return isError() ? (Result<R2, E>) this : mapper.apply(unsafeGet());
    }

    /**
     * Returns this if result of applying
     * predicate to this value is true
     * (if this result is ok)
     * <p>
     * Returns this result if this result is error.
     * <p>
     * Returns ResultError containing E if predicate failed
     *
     * @param predicate The predicate to test
     * @param error     The error to insert if failed
     */
    @NotNull
    public Result<R, E> filter(@NotNull Predicate<R> predicate, E error) {
        if (isError() || predicate.test(unsafeGet())) {
            return this;
        }
        return error(error);
    }

    /**
     * Same as map, but maps error instead of value
     */
    @NotNull
    public <E2> Result<R, E2> mapError(@NotNull Function<E, E2> mapper) {
        //noinspection unchecked
        return isError() ? error(mapper.apply(unsafeGetError())) : (Result<R, E2>) this;
    }

    /**
     * @return value if this result is ok, otherwise null
     */
    @Nullable
    public R orNull() {
        return isError() ? null : unsafeGet();
    }
}

