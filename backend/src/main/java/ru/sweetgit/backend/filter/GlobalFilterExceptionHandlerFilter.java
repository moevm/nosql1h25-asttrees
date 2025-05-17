package ru.sweetgit.backend.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class GlobalFilterExceptionHandlerFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(GlobalFilterExceptionHandlerFilter.class);

    @Qualifier("handlerExceptionResolver")
    private final HandlerExceptionResolver handlerExceptionResolver;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (Exception ex) {
            if (response.isCommitted()) {
                log.warn("Response already committed. Unable to handle exception: {}", ex.getMessage());
                throw ex;
            }

            ModelAndView mav = handlerExceptionResolver.resolveException(request, response, null, ex);

            if (mav == null) {
                log.warn("HandlerExceptionResolver did not handle the exception: {}. Re-throwing.", ex.getClass().getName());
                throw ex;
            }
        }
    }
}
