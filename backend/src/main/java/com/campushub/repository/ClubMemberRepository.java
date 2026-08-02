package com.campushub.repository;

import com.campushub.entity.ClubMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubMemberRepository extends JpaRepository<ClubMember, Long> {

    List<ClubMember> findByClub_Id(Long clubId);

    Optional<ClubMember> findByClub_IdAndUser_Id(Long clubId, Long userId);

    boolean existsByClub_IdAndUser_Id(Long clubId, Long userId);
}