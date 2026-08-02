package com.campushub.service;

import com.campushub.dto.ClubDto;
import com.campushub.dto.ClubMemberDto;

import java.util.List;

public interface ClubService {

    List<ClubDto> getAllClubs();

    ClubDto getClubById(Long id);

    ClubDto createClub(ClubDto clubDto);

    ClubDto updateClub(Long id, ClubDto clubDto);

    void deleteClub(Long id);

    ClubMemberDto joinClub(Long clubId, Long userId);

    void leaveClub(Long clubId, Long userId);

    List<ClubMemberDto> getClubMembers(Long clubId);
}