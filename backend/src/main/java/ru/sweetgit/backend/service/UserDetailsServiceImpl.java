package ru.sweetgit.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ru.sweetgit.backend.dto.UserDetailsWithId;
import ru.sweetgit.backend.model.UserModel;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    public static final String ROLE_ADMIN = "ROLE_ADMIN";

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return buildUserDetails(userService.getUserByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username)));
    }


    public UserDetails buildUserDetails(UserModel user) {
        var authorities = new ArrayList<GrantedAuthority>();
        if (user.getIsAdmin()) {
            authorities.add(new SimpleGrantedAuthority(ROLE_ADMIN));
        }

        return new UserDetailsWithId(
                user.getId(),
                user.getUsername(),
                user.getPasswordHash(),
                authorities
        );
    }
}
